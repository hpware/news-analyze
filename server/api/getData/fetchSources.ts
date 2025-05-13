import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const query = getQuery(event);
  /*const sources = await sql`SELECT * FROM sources`;
    return sources;*/
  // Fake data
  return {
    status: "ok",
    data: [
      {
        id: 1,
        title: "Source 1",
        logo: "#",
        url: "https://source1.com",
        description: "Description for Source 1",
      },
      {
        id: 2,
        title: "Source 2",
        logo: "#",
        url: "https://source2.com",
        description: "Description for Source 2",
      },
    ],
  };
});
