import { Groq } from 'groq-sdk';

const groq = new Groq();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const fetchNewsArticle = await fetch(`/api/`);
  const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "user",
            "content": ``
          },
          {
            "role": "system",
            "content": `You are a news summarizer. You will be given a news article and you will summarize it into a short paragraph.`
          }
        ],
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });
    
  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
})