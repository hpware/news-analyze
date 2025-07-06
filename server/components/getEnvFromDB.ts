import sql from "~/server/components/postgres";
interface variReturn {
  name: string;
  var: string;
}
export default async function (vari: string) {
  const fetchVar = await sql<variReturn[]>`
    SELECT * FROM global_vars
    WHERE NAME = ${vari}`;
  if (fetchVar.length === 0) {
    throw new Error(
      "Cannot find var in the database. Have you followed this? https://github.com/hpware/news-analyze?tab=readme-ov-file#notes",
    );
  }
  return fetchVar[0].var;
}
