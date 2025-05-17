// This should be hooked up to a database soon.
import postgres from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const loginCookie = getCookie(event, "session");
  const lastCheckCookie = getCookie(event, "last_check");
  if (!lastCheckCookie && loginCookie) {
    deleteCookie(event, "session");
    deleteCookie(event, "lastCheckCookie");
    return {
      auth: false,
      user: null,
    };
  }
  const checkDate = new Date().toLocaleString();
  console.log(checkDate);
  setCookie(event, "lastCheckCookie", checkDate, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return {
    auth: true,
    user: "testing",
  };
});
