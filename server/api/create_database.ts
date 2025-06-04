import sql from "~/server/components/postgres";
const createSources = await sql``;

export default defineEventHandler(async (event) => {
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

  return {
    createUsers: createUsers,
    usersList: usersList,
    createUserAiChatHistory: createUserAiChatHistory,
    createSources: createSources,
  };
});
