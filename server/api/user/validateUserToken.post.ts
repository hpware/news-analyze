import sql from "~/server/components/postgres";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = getCookie(event, "token");
  if (!token) {
    return {
      error: "INVALID_TOKEN",
      requested_action: "LOGOUT_USER",
    };
  }
  const checkIsUUIDRegex =
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
  if (!checkIsUUIDRegex.test(token)) {
    return {
      error: "NOT_A_UUID",
      requested_action: "LOGOUT_USER",
    };
  }
  const fetchViaSQL = await sql`
    SELECT * FROM usertokens
    where token=${token}
    `;
  if (!fetchViaSQL[0]) {
    return {
      error: "INVALID_TOKEN",
      requested_action: "LOGOUT_USER",
    };
  }

  const tokenDate = new Date(fetchViaSQL[0].created_at);
  const now = new Date();
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  if (now.getTime() - tokenDate.getTime() > dayInMilliseconds) {
    return {
      error: "TOKEN_EXPIRED",
      requested_action: "LOGOUT_USER",
    };
  }
  return {
    userAccount: fetchViaSQL[0].username,
    requested_action: "CONTINUE",
    email: fetchViaSQL[0].email,
    avatarURL: fetchViaSQL[0].avatarurl,
    firstName: fetchViaSQL[0].firstName,
  };
});
