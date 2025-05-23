import sql from "~/server/components/postgres";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";

const defaultAvatarUrl = "https://s3.yhw.tw/news-analyze/avatar/default.png";

export default defineEventHandler(async (event) => {
  const salt = process.env.PASSWORD_HASH_SALT;
  if (!salt) {
    return {
      error: "SALT_NOT_FOUND",
    };
  }
  const body = await readBody(event);
  const { username, password } = body;
  if (!username || !password) {
    return {
      error: "NO_USER_AND_PASSWORD_SUBMITED",
    };
  }
  const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
  if (!USERNAME_PATTERN.test(username)) {
    return {
      error: "INVALD_USER_ACCOUNT",
    };
  }
  // Server side hashing
  const hashedPassword = await argon2.hash(salt, password);

  // Check if user exists, if not, create a user
  try {
    const fetchUserInfo = await sql`
      select * from users
      where user = ${username}`;
    if (!fetchUserInfo) {
      const createNewUser = await sql`
        insert into users (uuid, username, passwordhash)
        values (${uuidv4()}, ${username}, ${hashedPassword})
        `;
      if (!createNewUser) {
        return {
          error: "CANNOT_CREATE_NEW_USER",
        };
      }
    } else {
      if (fetchUserInfo.password !== hashedPassword) {
        return {
          error: "PASSWORD_NO_MATCH",
        };
      }
      const newToken = uuidv4();
      const newToken64 = atob(newToken);
      const saveNewToken = await sql`
        insert into usertokens
        `;
      if (!saveNewToken) {
        return {
          error: "CANNOT_CREATE_NEW_TOKEN",
        };
      }
      return {
        user: fetchUserInfo.user,
        token: newToken,
      };
    }
  } catch (e) {
    return {
      error: "UNABLE_TO_PROCESS",
    };
  }
});
