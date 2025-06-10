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
    let allowed = true;
    if (body.value.match()) {
      allowed = false;
    }
    // Use Static values for now.
    const requestChange = "groq_api_key";
    const apiKeyqq = body.value.match(clearBadDataRegex);
    const allowedColumns = ["groq_api_key", "another_column_name"];

    if (!allowedColumns.includes(requestChange)) {
      throw new Error("Invalid column name provided");
    }

    const sqlC = await sql.unsafe(
      `
      UPDATE user_other_data SET ${requestChange} = $1
      WHERE username = $2`,
      [apiKeyqq[0], token.user],
    );
    return {
      sqlC: sqlC,
      success: true,
    };
  }
});
