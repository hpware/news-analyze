import sql from "~/server/components/postgres";
export default async function getUserTokenMinusSQLInjection(event) {
  const userToken = await getCookie(event, "token");
  if (!userToken) {
    return {
      token: null,
      user: null,
      error: "NO_TOKEN",
    };
  }
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userToken)) {
    return {
      token: null,
      user: null,
      error: "INVALID_TOKEN_FORMAT",
    };
  }
  const getUser = await sql`
    select * from usertokens
    where token = ${userToken}`;
  if (getUser.length === 0) {
    return {
      token: null,
      user: null,
      error: "NOT_AUTHED",
    };
  }
  return {
    token: userToken,
    user: getUser[0].username,
    error: "",
  };
}
