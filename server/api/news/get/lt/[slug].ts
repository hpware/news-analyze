import lineToday from "~/server/scrape/line_today";
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const data = await lineToday(slug);
  console.log(data);
  return data;
});
