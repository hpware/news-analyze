import sql from "~/server/components/postgres";
import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
export default defineEventHandler(async (event) => {
  // Check user data.
  const user = await getUserTokenMinusSQLInjection(event);
  if (user.error.length !== 0) {
    return {
      error: user.error,
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
    [apiKeyqq[0], user.user],
  );
  return {
    body: body,
    data: body.value.match(clearBadDataRegex),
    sqlC: sqlC,
  };
});
