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

const createNewsProviders = await sql`
create table if not exists newsProviders (
    uuid text primary key,
    title text not null,
    slug text unique,
    website text not null,
    description text not null,
    facebookUrl text,
    twitterUrl text,
    threadsUrl text,
    logoUrl text not null,
    lean text not null
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

const newsArticles = await sql`
create table if not exists news_articles (
uuid text primary key,
title text not null,
content text not null,
news_org text not null,
origin_link text not null,
author text,
related_uuid text not null
)
`;

const hotNews = await sql`
create table if not exists hot_news (
    uuid text primary key,
    title text not null,
    news_org text not null,
    link text not null,
    related_uuid text not null,
    created_at timestamptz default current_timestamp
)
`;

const articlesLt = await sql`
create table if not exists articles_lt (
uuid text primary key,
title text not null,
content text not null,
origin text not null,
author text,
)
`;

console.log("Creation Complete");

await sql.end();
process.exit(0);
