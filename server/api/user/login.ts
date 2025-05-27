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
  // Server side hashing

  // Check if user exists, if not, create a user
  try {
    console.log(username);
    const fetchUserInfo = await sql`
      select * from users
      where username = ${username}`;
    console.log(fetchUserInfo[0]);
    if (fetchUserInfo.length === 0) {
        const hashedPassword = await argon2.hash(salt + password);
        const createNewUser = await sql`
        insert into users (uuid, username, passwordhash)
        values (${uuidv4()}, ${username}, ${hashedPassword})
        `;
        console.log(createNewUser);
      if (fetchUserInfo.length !== 0) { 
        return {
          error: "CANNOT_CREATE_NEW_USER",
        };
      }
      const newToken = uuidv4();
      //const newToken64 = atob(newToken);
      return {
        user: fetchUserInfo,
        token: newToken,
      };
    } else {
      const isValid = await argon2.verify(fetchUserInfo[0].passwordhash, salt + password);
      if (!isValid) {
        return {
          error: "PASSWORD_NO_MATCH",
        };
      }
    }
    const newToken = uuidv4();
    const newToken64 = btoa(newToken);
    const fetchUserInfoAgain = await sql`
      select * from users
      where username = ${username}`;
      /*await sql`
        INSERT INTO usertokens (user, token)
        VALUES (${fetchUserInfo[0].username}, ${newToken64})
      `;*/
      return {
        user: fetchUserInfoAgain,
        token: newToken,
      };
  } catch (e) {
    console.log(e);
    return {
      error: "UNABLE_TO_PROCESS",
    };
  }
});
