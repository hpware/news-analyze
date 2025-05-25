export default defineEventHandler(async (event) => {
  return {
    data: [
      {
        text: "國內",
        url: "domestic",
        default: true,
      },
      {
        text: "國外",
        url: "global",
        default: false,
      },
    ],
  };
});
