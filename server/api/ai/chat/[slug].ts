import { Groq } from "groq-sdk";
import sql from "~/server/components/postgres";

const groq = new Groq();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const body = await readBody(event);
  const fetchNewsArticle = await sql`
    select * from newArticle
    where slug = ${slug}
  `;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${body}`,
      },
      {
        role: "system",
        content: `You are a news chat, the following content will be used to chat with the user title: ${fetchNewsArticle.title}\n content: ${fetchNewsArticle.content}`,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
});
