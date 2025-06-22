import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";

export default defineEventHandler(async (event) => {
  const userToken = await getUserTokenMinusSQLInjection(event);
  if (userToken.error.length !== 0) {
    return {
      error: userToken.error,
    };
  }
  try {
    deleteCookie(event, "token");
    return {
      success: true,
      error: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
});
