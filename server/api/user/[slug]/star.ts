import sql from "~/server/components/postgres";
import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");
    const token = await getUserTokenMinusSQLInjection(event);
    if (token.error.length !== 0) {
      return {
        error: token.error,
      };
    }
    const getOtherUserDataJsonFile = await sql`
      SELECT starred_news from user_other_data
      where username = ${token.user}
      `;
    if (getOtherUserDataJsonFile.length === 0) {
      return {
        error: "ERR_NO_DATA",
      };
    }
    const jsonData = getOtherUserDataJsonFile[0].starred_news;
    return jsonData;
  } catch (e) {
    console.log(e);
    return {
      error: "INTERNAL_SERVER_ERR",
      e: e.message,
    };
  }
});
