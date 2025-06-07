import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { request_change } = body;
  const userToken = getCookie(event, "token");
  if (!userToken) {
    return {
      error: "ERR_NOT_ALLOWED",
    };
  }
  const checkUserToken = await sql`
    select * from usertokens
    where token=${userToken}
    `;
  if (checkUserToken.length === 0) {
    return {
      error: "ERR_NOT_ALLOWED",
    };
  }
});
