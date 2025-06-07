import sql from "./postgres";

export async function checkIfUserHasCustomGroqKey(token?: string) {
  if (!token) {
    return {
      status: false,
      customApi: "",
    };
  }
  const checkRealToken = await sql`
    select * from usertokens
    where tokens=${token}
  `;
  if (checkRealToken.length === 0) {
    return {
      status: false,
      customApi: "",
    };
  }
  const fetchUserToken = await sql`
    select groq_api_key from user_other_data
    where username=${checkRealToken[0].username}`;
  if (fetchUserToken.length === 0) {
    return {
      status: false,
      customApi: "",
    };
  }
  return {
    status: true,
    customAPi: fetchUserToken[0].groq_api_key,
  };
}
