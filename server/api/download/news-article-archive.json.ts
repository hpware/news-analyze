import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const articles = await sql`
    SELECT * FROM news_articles;
  `;
  setHeaders(event, {
    "Content-Type": "application/json",
    "Content-Disposition": `attachment; filename="news-articles-export-${new Date().toISOString().split("T")[0]}.json"`,
  });
  return articles;
});
