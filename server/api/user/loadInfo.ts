/*// Fixed data for testing
export default defineEventHandler(async (event) => {
  return {
    doNotShowLangPrefPopUp: false,
    email: "test@yuanhau.com",
    name: "Howard",
    useCustomGroqKey: true,
    translate: {
      enabled: true,
      lang: "en",
      provider: "google", // Default provider
    },
  };
});
*/
import sql from "~/server/components/postgres";
import getUserTokenMinusSQLInjection from "~/server/components/getUserToken";
export default defineEventHandler(async (event) => {
  try {
    const token = await getUserTokenMinusSQLInjection(event);
    if (token.error.length !== 0) {
      return {
        error: token.error,
      };
    }
    const fetchMainData = await sql`
      SELECT * FROM users
      WHERE username = ${token.user}
      `;
    const fetchOtherUserData = await sql`
      SELECT * FROM user_other_data
      WHERE username = ${token.user}
      `;

    if (fetchMainData.length === 0 || fetchOtherUserData.length === 0) {
      return {
        error: "ERR_USER_DOESNT_EXIST",
      };
    }
    return {
      doNotShowLangPrefPopUp:
        fetchOtherUserData[0].remove_translate_popup || false,
      email: fetchMainData[0].email || "",
      name: fetchMainData[0].firstname || "",
      useCustomGroqKey: +(fetchOtherUserData[0].groq_api_key?.length ?? 0) > 0,
      translate: {
        enabled: fetchOtherUserData[0].translate_enabled || false,
        lang: "en",
        provider: fetchOtherUserData[0].translate_provider || "google",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      error: "ERR_SERVER_SIDE",
      e: e.message,
    };
  }
});
