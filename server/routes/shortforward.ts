export default defineEventHandler((event) => {
  const query = getQuery(event);
  const toolCall = query.tool;
  const forwardCall = query.forward;
  if (toolCall) {
    const buildUrl = "/desktop?openapp=" + toolCall;
    return sendRedirect(event, buildUrl, 302);
  }
  if (forwardCall) {
    const buildUrl = "/" + forwardCall;
    return sendRedirect(event, buildUrl, 302);
  }
  return sendRedirect(event, "/", 302);
});
