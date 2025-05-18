import lineToday from "~/server/scrape/line_today";
import sql from "~/server/components/postgres";
import saveDataToSql from "~/server/scrape/save_scrape_data";

function cleanUpSlug(orgslug: string) {
  let slug = dirtySlug.trim();
  const validSlugRegex = /^[a-zA-Z0-9-]+$/;
  if (!validSlugRegex.test(slug)) {
    throw new Error("Invalid slug format");
  }
  return slug;
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const cleanSlug = await cleanUpSlug(slug);
  const result = await sql`
       select * from articles_lt
       where slug = ${cleanSlug}
  `;
  if (result) {
    return result;
  } else {
    const data = await lineToday(slug);
    saveDataToSql(data, slug);
    return data;
  }
});
