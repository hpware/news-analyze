import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const userToken = await getUserTokenMinusSQLInjection(event);
  if (userToken.error.length !== 0) {
    return {
      error: userToken.error,
    };
  }
  const getData = await sql`
    SELECT * FROM user_other_data
    WHERE username = ${userToken.user}
    `;
  return {
    items: getData[0].starred_news,
  };
});
