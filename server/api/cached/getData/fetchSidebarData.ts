export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return {
    0: {
      id: "1",
      image: "whatever",
      tags: [],
      title: "三立新聞",
      lean: "left",
      score: "40",
    },
  };
});
