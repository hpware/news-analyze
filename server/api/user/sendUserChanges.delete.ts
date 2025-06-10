import sql from "~/server/components/postgres";
import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
export default defineEventHandler(async (event) => {
  try {
    const userToken = await getUserTokenMinusSQLInjection(event);
    if (userToken.error.length !== 0) {
      return {
        error: userToken.error,
      };
    }
    // REMOVE OLD TOKENS
    const removeToken = await sql`
    DELETE FROM usertokens
    WHERE username = ${userToken.user}
    `;
    console.log(removeToken);
    // DELETE USER
    const deleteUserAccount = await sql`
    DELETE FROM users
    WHERE username = ${userToken.user}
    `;
    console.log(deleteUserAccount);
    deleteCookie(event, "token");
    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      error: "INTERNAL_SERVER_ERROR",
      e: e.message,
    };
  }
});
