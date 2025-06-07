import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    return {
      error: "ERR_METHOD_NOT_ALLOWED",
    };
  }
  const body = readBody(event);
  if (!body.apiKey) {
    return {
      error: "ERR_API_KEY_REQUIRED",
    };
  }
  const readUserToken = getCookie(event, "token");
  if (!readUserToken) {
    return {
      error: "ERR_NOT_USER_LOGIN",
    };
  }
  const verifyUserToken = await sql`
    SELECT * FROM usertokens
    where token=${readUserToken}
    `;
  if (verifyUserToken.length === 0) {
    return {
      error: "ERR_NOT_USER_LOGIN",
      requested_action: "LOGOUT_USER",
    };
  }
});
