import { Groq } from "groq-sdk";
import sql from "~/server/components/postgres";
import { checkIfUserHasCustomGroqKey } from "~/server/components/customgroqsystem";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const slug = getRouterParam(event, "slug");
  const userToken = getCookie(event, "token") || "";
  console.log("Token: ", userToken);
  const doesTheUserHasACustomGroqApiAndWhatIsIt =
    await checkIfUserHasCustomGroqKey(userToken);
  let groqClient = groq;
  if (doesTheUserHasACustomGroqApiAndWhatIsIt.status === true) {
    groqClient = new Groq({
      apiKey: doesTheUserHasACustomGroqApiAndWhatIsIt.customApi,
    });
  } else {
    console.log(process.env.GROQ_API_KEY); // DEBUGGING ONLY!!! THIS ONLY CONTAINS THE .ENV KEYS NOT THE USER ONES
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  const query = getQuery(event);
  const locale = query.locale;
  const buildURL = protocol + "://" + host + "/api/news/get/lt/" + slug;
  const data = await fetch(buildURL);
  const fetchNewsArticle = await data.json();
  console.log(locale);
  const chatCompletion = await groqClient.chat.completions.create({
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
