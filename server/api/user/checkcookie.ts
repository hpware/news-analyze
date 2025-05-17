// This should be hooked up to a database soon.
import postgres from "~/server/components/postgres";

// Parse Date Function
function checkDate(dateString: string) {
  const now = new Date();
  const parsed = new Date(dateString);
  const timer = 60 * 60 * 1;
  return now.getTime() - parsed.getTime() > timer;
}

export default defineEventHandler(async (event) => {
  const loginCookie = getCookie(event, "session");
  const lastCheckCookie = getCookie(event, "last_check");
  const nowDate = new Date().toLocaleString();
  console.log(nowDate);
  if (!lastCheckCookie && loginCookie) {
    deleteCookie(event, "session");
    setCookie(event, "lastCheckCookie", nowDate, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return {
      auth: false,
      user: null,
    };
  }
  if (!lastCheckCookie) {
    setCookie(event, "lastCheckCookie", nowDate, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  if (checkDate(String(lastCheckCookie))) {
    setCookie(event, "lastCheckCookie", nowDate, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return {
    auth: true,
    user: "testing",
  };
});
