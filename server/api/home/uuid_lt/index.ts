export default defineEventHandler((event) => {
  return sendRedirect(event, "/datainfo/linetodayjsondata.json", 302);
});
