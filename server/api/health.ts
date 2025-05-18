export default defineEventHandler(async () => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "unknown",
  };
});
