let cachedData: { data: string[]; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour
export default defineEventHandler(async (event) => {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return {
      data: cachedData.data,
      cached: true
    };
  }
   try {
    const req = await fetch("https://today.line.me/_next/data/v1/tw/v3/tab/domestic.json?tabs=domestic", {
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const res = await req.json();
    const req2 = res.pageProps.fallback.getTabsData.modules;
    cachedData = {
      data: req2,
      timestamp: Date.now(),
    };
    return {
      data: req2,
      cached: false
    };
  } catch (e) {
    return {
      "error": "INTERNAL_SERVER_ERROR"
    }
  }
});
