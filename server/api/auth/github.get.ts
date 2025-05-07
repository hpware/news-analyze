import crypto from "node:crypto"
export default defineEventHandler(async (event) => {
    const baseUrl = event.node.req.headers.host 
    const protocol = process.env.NODE_ENV === "production" ? "https": "http"
    const clientId = process.env.NUXT_GITHUB_CLIENT_ID;
    const callbackUrl = `${protocol}://${baseUrl}/api/auth/github/callback`;
    const state = crypto.randomBytes(16).toString("hex");
    setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    path: '/', 
  })
  const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=read:user,user:email&state=${state}`
  await sendRedirect(event, authorizationUrl, 302)
})