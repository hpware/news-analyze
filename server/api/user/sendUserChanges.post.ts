import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  // Check user data.
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
  // Actual function
  const body = await readBody(event);
  if (body.jsonValue.length === 0) {
    const clearBadDataRegex = /[@-_.+a-zA-Z0-9]{2,}/;
    let allowed = true;
    if (body.value.match()) {
      allowed = false;
    }
    return {
      body: body,
      allowed: allowed,
      data: body.value.match(clearBadDataRegex),
    };
  }
});
