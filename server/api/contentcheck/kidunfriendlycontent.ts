import sql from "~/server/components/postgres";
export default defineEventHandler(async (event) => {
  return {
    words: ["violence"],
  };
});
