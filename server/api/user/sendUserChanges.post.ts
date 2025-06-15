import sql from "~/server/components/postgres";
import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
export default defineEventHandler(async (event) => {
  // Check user data.
  const token = await getUserTokenMinusSQLInjection(event);
  if (token.error.length !== 0) {
    return {
      error: "ERR_NOT_ALLOWED",
    };
  }
  // Actual function
  const body = await readBody(event);
  if (body.jsonValue.length === 0) {
    const clearBadDataRegex = /[@-_.+a-zA-Z0-9]{2,}/;
    // Use Static values for now.
    const requestChange = body.action || "";
    const apiKeyqq = body.value.match(clearBadDataRegex);
    console.log(apiKeyqq);  
    const allowedColumns = ["firstname", "email"];

    if (!allowedColumns.includes(requestChange)) {
      return {
        error: "ERR_NOT_ALLOWED",
      };
    } else if (requestChange === "firstname") {
      const sqlC = await sql`
        UPDATE users SET firstname = ${apiKeyqq[0]}
        WHERE username = ${token.user}`;
      return {
        sqlC: sqlC,
        success: true,
      };
    } else if (requestChange === "email") {
      const sqlC = await sql`
        UPDATE users SET email = ${apiKeyqq[0]}
        WHERE username = ${token.user}`;
      return {
        sqlC: sqlC,
        success: true,
      };
    }
    const sqlC = await sql.unsafe(
      `UPDATE user_other_data SET ${requestChange} = $1 WHERE username = $2`,
      [apiKeyqq[0], token.user],
    );
    return {
      sqlC: sqlC,
      success: true,
    };
  }
});
