export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");
    const urlBuild = "/api/home/uuid_lt/" + slug;
    const articleArray = [];
    const req = await fetch(urlBuild);
    const res = await req.text();
    return res;
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERROR",
    };
  }
});
