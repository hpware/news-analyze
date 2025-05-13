import { Groq } from "groq-sdk";
import sql from "~/server/components/postgres";

const groq = new Groq();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "A UUID is required for this action.",
    });
  }
  const getChatHistory = await sql`
    select * from chatHistory
    where uuid = ${slug}
    order by created_ata asc
  `;
  if (getChatHistory.length === 0) {
  }
  const body = await readBody(event);
  const fetchNewsArticle = await sql`
    select * from newArticle
    where newsid = ${body.newsid}
  `;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a news chat, the following content will be used to chat with the user title: ${fetchNewsArticle.title}\n content: ${fetchNewsArticle.content}`,
      },
      ...getChatHistory.map((chat) => ({
        role: chat.role,
        content: chat.content,
      })),
      {
        role: "user",
        content: `${body}`,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });
  await sql`
    INSERT INTO chat_history (uuid, role, content)
    VALUES (${slug}, 'user', ${body})
  `;
  let assistantResponse = "";
  for await (const chunk of chatCompletion) {
    const content = chunk.choices[0]?.delta?.content || "";
    assistantResponse += content;
    process.stdout.write(content);
  }
  if (assistantResponse) {
    await sql`
      INSERT INTO chat_history (uuid, role, content)
      VALUES (${slug}, 'assistant', ${assistantResponse})
    `;
  }
});
