import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";

export default defineEventHandler(async (event) => {
  const loginCookie = await getUserTokenMinusSQLInjection(event);
  try {
    if (false) {
      deleteCookie(event, "token");
      return {
        success: true,
        error: null,
      };
    }
    return "testing";
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
});
