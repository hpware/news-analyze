export default async function loadUserInfo() {
  return {
    langPref: "en",
    doNotShowLangPrefPopUp: false,
    email: "test@yuanhau.com",
    name: "Howard",
    useCustomGroqKey: true,
    translate: {
      enabled: true,
      lang: "en",
      provider: "google",
    },
  };
}
