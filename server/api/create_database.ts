import sql from "~/server/components/postgres";
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

  const createUserOtherData = await sql`
    create table if not exists user_other_data (
    user_id text primary key,
    username text not null unique,
    groq_api_key text,
    starred_news JSON not null,
    translate_provider text,
    translate_enabled boolean not null,
    remove_translate_popup boolean not null
    )`;

  const createSources = await sql`
    create table if not exists lt_news_org (
    news_id text primary key,
    name text not null,
    description text
    )
    `;

  const createArticlesArchive = await sql`
    create table if not exists news_articles (
    uuid text primary key,
    article_id text primary key,
    jsondata json not null,
    archive_timestamp timestamp default CURRENT_TIMESTAMP,
    )
    `;

  return {
    createUsers: createUsers,
    usersList: usersList,
    createUserAiChatHistory: createUserAiChatHistory,
    createSources: createSources,
    createUserOtherData: createUserOtherData,
    createArticlesArchive: createArticlesArchive,
  };
});
