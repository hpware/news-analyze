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
  console.log(password);
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
  // Check if user exists, if not, create a user
  try {
    console.log(username);
    const fetchUserInfo = await sql`
      select * from users
      where username = ${username}`;
    console.log(fetchUserInfo[0]);
    if (fetchUserInfo.length === 0) {
      const hashedPassword = await argon2.hash(salt + password);
      const userUUID = uuidv4();
      const createNewUser = await sql`
        insert into users (uuid, username, passwordhash, avatarurl)
        values (${userUUID}, ${username}, ${hashedPassword}, ${defaultAvatarUrl})
        `;
      console.log(createNewUser);
      if (fetchUserInfo.length !== 0) {
        return {
          error: "CANNOT_CREATE_NEW_USER",
        };
      }
      await sql`
        insert into user_other_data(user_id, username, translate_enabled, translate_provider, remove_translate_popup, starred_news)
        values (${userUUID}, ${username}, false, 'google', false, '{}'::JSON)
        `;
      const newToken = uuidv4();
      await sql`
          INSERT INTO usertokens (username, token)
          VALUES (${username}, ${newToken})
      `;

      setCookie(event, "token", newToken);
      const fetchUserInfoAgain = await sql`
        select * from users
        where username = ${username}`;
      return {
        user: fetchUserInfoAgain,
      };
    } else {
      const isValid = await argon2.verify(
        fetchUserInfo[0].passwordhash,
        salt + password,
      );
      if (!isValid) {
        return {
          error: "PASSWORD_NO_MATCH",
        };
      }
      const newToken = uuidv4();
      const fetchUserInfoAgain = await sql`
        select * from users
        where username = ${username}`;
      await sql`
          INSERT INTO usertokens (username, token)
          VALUES (${fetchUserInfoAgain[0].username}, ${newToken})
      `;

      const getUserFirstName = await sql`
        select * from user_other_data`;

      setCookie(event, "token", newToken);
      return {
        user: fetchUserInfoAgain,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      error: "UNABLE_TO_PROCESS",
    };
  }
});
