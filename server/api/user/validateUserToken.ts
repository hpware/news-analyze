import sql from "~/server/components/postgres";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");
  if (!token) {
    return {
      error: "INVALID_TOKEN",
      requested_action: "USE_DEFAULT_STATE",
      current_spot: "LOGOUT",
    };
  }
  const checkIsUUIDRegex =
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
  if (!checkIsUUIDRegex.test(token)) {
    return {
      error: "NOT_A_UUID",
      requested_action: "LOGOUT_USER",
      current_spot: "LOGOUT",
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
      current_spot: "LOGOUT",
    };
  }

  const getUserInfo = await sql`
    SELECT * FROM users
    WHERE username = ${fetchViaSQL[0].username}
    `;

  const tokenDate = new Date(fetchViaSQL[0].created_at);
  const now = new Date();
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  if (now.getTime() - tokenDate.getTime() > dayInMilliseconds) {
    return {
      error: "TOKEN_EXPIRED",
      requested_action: "LOGOUT_USER",
      current_spot: "LOGOUT",
    };
  }
  return {
    userAccount: fetchViaSQL[0].username,
    firstName: getUserInfo[0].firstname || "",
    requested_action: "CONTINUE",
    current_spot: "KEEP_LOGIN",
    email: getUserInfo[0].email || "",
    avatarURL: getUserInfo[0].avatarurl || "",
  };
});
