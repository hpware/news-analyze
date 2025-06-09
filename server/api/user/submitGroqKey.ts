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
  const clearBadDataRegex = /[@-_.+a-zA-Z0-9]{2,}/;
  const requestChange = "groq_api_key";
  const apiKeyqq = body.value.match(clearBadDataRegex);

  const sqlC = await sql.unsafe(
    `
      UPDATE user_other_data SET ${requestChange} = $1
      WHERE username = $2`,
    [apiKeyqq[0], checkUserToken[0].username],
  );
  return {
    body: body,
    data: body.value.match(clearBadDataRegex),
    sqlC: sqlC,
  };
});
