import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  try {
    const fetchDataInSQL = await sql`
        SELECT * FROM lt_news_org;
        `;
    return {
      data: fetchDataInSQL,
    };
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERR",
      elogs: e.message,
    };
  }
});
