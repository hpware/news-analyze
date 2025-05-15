export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const body = await readBody(event);
  return {
    body: body,
    title: "News Org 1",
    slug: "taisounds",
    website: "https://yuanhau.com",
    description: "wah wah wah wah wah wah I dont fucking care",
    facebook: "https://www.facebook.csdkc",
    logoUrl:
      "https://cdn.discordapp.com/avatars/918723093646684180/4eecc27ac05ee8a701fa167808610c7a.jpg",
  };
});
