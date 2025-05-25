import { Groq } from "groq-sdk";
import sql from "~/server/components/postgres";

const groq = new Groq();

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const slug = getRouterParam(event, "slug");
  const query = getQuery(event);
  const locale = query.locale;
  const buildURL = protocol + "://" + host + "/api/news/get/lt/" + slug;
  const data = await fetch(buildURL);
  const fetchNewsArticle = await data.json();
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${fetchNewsArticle.title}\n${fetchNewsArticle.paragraph}`,
      },
      {
        role: "system",
        content: `You are a news summarizer. You will be given a news article and you will summarize it into a short paragraph. The user's current locale is ${locale || "zh-tw"} please use the correct language as the response.`,
      },
    ],
    model: "gemma2-9b-it",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  return sendStream(event, stream);
});
