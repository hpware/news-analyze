// This should be hooked up to a database soon.
import postgres from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const loginCookie = getCookie(event, "session");
  return {
    auth: "true",
    user: "testing",
  };
});
