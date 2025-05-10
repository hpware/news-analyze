import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug || typeof slug !== "string") {
    throw createError({
      statusCode: 400,
      message: "Invalid slug parameter",
    });
  }
  const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  try {
    const result = await sql`
        select * from go_links
        where slug = ${cleanSlug}
        `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
