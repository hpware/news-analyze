import postgres from "~/server/components/postgres";
import { v4 as uuidv4 } from "uuid";

async function saveDataToSql(
  data: { title: string; paragraph: string; author: string; origin: string },
  slug: string,
) {
  const sql = postgres;
  await sql`
    INSERT INTO articles_lt (uuid, slug, title, content, author, origin)
    VALUES (${uuidv4()}, ${slug}, ${data.title}, ${data.paragraph}, ${data.author}, ${data.origin})
    ON CONFLICT (slug) DO NOTHING
  `;
}
export default saveDataToSql;
