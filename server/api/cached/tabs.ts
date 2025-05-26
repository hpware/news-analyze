export default defineEventHandler(async (event) => {
  try {
    const buildUrl = `https://today.line.me/_next/data/v1/tw/v3/tab/${type}.json?tabs=${type}`;
    const req = await fetch(buildUrl, {
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const res = await req.json();
    const req2 = res.pageProps.fallback.getTabsData.modules;
    return req2;
  } catch (e) {
    return {
      data: [
        {
          text: "國內",
          url: "domestic",
          default: true,
        },
        {
          text: "國外",
          url: "global",
          default: false,
        },
      ],
    };
  }
});
