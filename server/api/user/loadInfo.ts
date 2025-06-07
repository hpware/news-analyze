// Fixed data for testing
export default defineEventHandler(async (event) => {
  return {
    langPref: "en",
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
