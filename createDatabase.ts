import { sql } from "bun";

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

const createAdminPosts = await sql`
create table if not exists adminPosts (
    uuid text primary key,
    slug text not null unique,
    content text not null,
    created_at timestampz default current_timestamp,
    byUser text not null
)
`;
const adminUsers = await sql`
create table if not exists adminUsers (
    uuid text primary key,
    username text not null unique,
    passwordHash text not null,
    created_at timestampz default current_timestamp,
    lastlogged_at timestampz default current_timestamp,
)
`;

console.log("Creation Complete");
