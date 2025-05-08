export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name
  return name;
})