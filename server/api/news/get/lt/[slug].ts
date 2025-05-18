import lineToday from "~/server/scrape/line_today";
import sql from "~/server/components/postgres";
import saveDataToSql from "~/server/scrape/save_scrape_data";

function cleanUpSlug(orgslug: string) {
  let slug = orgslug.trim();
  const validSlugRegex = /^[a-zA-Z0-9-]+$/;
  if (!validSlugRegex.test(slug)) {
    throw new Error("Invalid slug format");
  }
  return slug;
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const cleanSlug = cleanUpSlug(slug);
  /*const result = await sql`
       select * from articles_lt
       where slug = ${cleanSlug}
       `;*/
  if (false) {
    //return result;
  } else {
    const data = await lineToday(cleanSlug);
    //saveDataToSql(data, slug);
    console.log(data);
    return data;
  }
});
