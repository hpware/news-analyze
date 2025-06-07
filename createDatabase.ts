import sql from "~/server/components/postgres";

const createUsers = await sql`
  create table if not exists users (
      uuid text primary key,
      created_at timestamptz default current_timestamp,
      username text not null unique,
      avatarurl text,
      firstname text,
      passwordhash text not null,
      email text
  );
`;

const usersList = await sql`
  create table if not exists usertokens (
      token text not null primary key,
      created_at timestamptz default current_timestamp,
      username text not null,
      email text,
      avatarurl text,
      firstname text
  )
`;

const createUserAiChatHistory = await sql`
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createUserOtherData = await sql`
  create table if not exists user_other_data (
  user_id text primary key ,
  user text not null unique,
  groq_api_key text,
  starred_news JSON not null,
  translate_provider text,
  translate_enabled boolean,
  remove_translate_popup boolean
  )`;

/*const createSources = await sql`
  create table if not exists source (
  )
  `;*/

console.log("Creation Complete");

await sql.end();
process.exit(0);
