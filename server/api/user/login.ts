import sql from "~/server/components/postgres";
import argon2 from "argon2";
export default defineEventHandler(async (event) => {
    const salt = process.env.PASSWORD_HASH_SALT;
    if (!salt) {
        throw createError({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
    const body = await readBody(event);
    const { username, password } = body;
    if (!username || !password) {
        throw createError({
            statusCode: 400,
            message: 'Username and password are required'
        });
    }
    const USERNAME_PATTERN =  /^[a-zA-Z0-9_]{3,20}$/; 
    if (!USERNAME_PATTERN.test(username)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid username.'
        });
    }
    // Server side hashing
    const hashedPassword = await argon2.hash(salt, password);

    // Check if user exists, if not, create a user
    try {
        console.log(username);
        console.log(hashedPassword);
    } catch (e) {

    }
})