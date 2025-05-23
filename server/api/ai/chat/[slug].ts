import { Groq } from "groq-sdk";
import sql from "~/server/components/postgres";

const groq = new Groq();

export default defineEventHandler(async (event) => {
  const host =  getRequestHost(event);
  const protocol =  getRequestProtocol(event);
  const hears =  getRequestHeaders(event);
  const slug = getRouterParam(event, "slug");
  const body = await readBody(event);
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "A UUID is required for this action.",
    });
  }

  const getChatHistory = await sql`
    select * from chat_history
    where uuid = ${slug}
    order by created_at asc
    `;

  const buildURL = protocol + "://" + host + "/api/news/get/lt/" + "LX30VwG";
  const data = await fetch(buildURL);
  const fetchNewsArticle = await data.json();

  // Set headers for Server-Sent Events
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");
  setHeader(event, "Access-Control-Allow-Origin", "*");

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a news chat, the following content will be used to chat with the user title: ${fetchNewsArticle.title} article: ${fetchNewsArticle.paragraph} origin: ${fetchNewsArticle.origin} author: ${fetchNewsArticle.author}`,
      },
      ...getChatHistory.map((chat) => ({
        role: chat.role,
        content: chat.content,
      })),
      {
        role: "user",
        content: body.message,
      },
    ],
    model: "gemma2-9b-it",
    temperature: 0.71,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  /*
  await sql`
    INSERT INTO chat_history (uuid, role, content)
    VALUES (${slug}, 'user', ${body.message})
  `; */

  let assistantResponse = "";

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            assistantResponse += content;
            // Send chunk to client
            controller.enqueue(new TextEncoder().encode(content));
          }
        }

        /*
        if (assistantResponse) {
          await sql`
            INSERT INTO chat_history (uuid, role, content)
            VALUES (${slug}, 'assistant', ${assistantResponse})
          `;
        } */

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return sendStream(event, stream);
});
