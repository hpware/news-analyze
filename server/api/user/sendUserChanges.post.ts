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
      [apiKeyqq[0], checkUserToken[0].username],
    );

    /**
     * // Example of how requestChange might be validated
     const allowedColumns = ['groq_api_key', 'another_column_name'];

     if (!allowedColumns.includes(requestChange)) {
       throw new Error('Invalid column name provided');
     }

     const sqlC = await sql`
           UPDATE user_other_data SET ${sql.identifier([requestChange])} = ${apiKeyqq[0]}
           WHERE username = ${checkUserToken[0].username}`;
     */
    return {
      body: body,
      allowed: allowed,
      data: body.value.match(clearBadDataRegex),
      sqlC: sqlC,
    };
  }
});
