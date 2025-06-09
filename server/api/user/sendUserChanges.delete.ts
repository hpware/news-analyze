export default defineEventHandler(async (event) => {
  const userToken = getCookie(event, "token");
  return {
    token: userToken,
  };
});
