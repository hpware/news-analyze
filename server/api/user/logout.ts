export default defineEventHandler(async (event) => {
  const loginCookie = getCookie(event, "session");
  const lastCheckCookie = getCookie(event, "last_check");
  const nowDate = new Date().toLocaleString();
  try {
    if (loginCookie) {
      deleteCookie(event, "token");
      return {
        success: true,
        error: null,
      };
    }
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
});
