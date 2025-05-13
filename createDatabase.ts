import sql from "~/server/components/postgres";

const createUsers = await sql`
create table if not exists users (
    uuid text primary key,
    created_at timestampz default current_timestamp,
    username text not null unique,
    oauthProvider text not null,
    avatarUrl text not null,
    email text not null,
    oauthProviderGivenId text not null
);
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

const createNewsProvidersZh = await sql`
create table if not exists newsProvidersZh (
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

const createGoLinks = await sql`
create table if not exists go_links {
    uuid text primary key,
    title text,
    slug text unique not null,
    forwardUrl text not null,
    created_at timestampz default current_timestamp
}
`;

const createUserAiChatHistory = await sql`
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

console.log("Creation Complete");
