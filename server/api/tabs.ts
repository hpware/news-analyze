const cacheEnabled = true;
let cachedData: { data: string[]; timestamp: number } | null = null;
const CACHE_DURAION = 1000 * 60 * 60; // 1 Hour
export default defineEventHandler(async (event) => {
  if (
    cachedData &&
    Date.now() - cachedData.timestamp < CACHE_DURATION &&
    cacheEnabled
  ) {
    return {
      data: cachedData.data,
      cached: true,
    };
  }
  try {
    const req = await fetch(
      "https://today.line.me/_next/data/v1/tw/v3/tab/domestic.json?tabs=domestic",
      {
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    );
    const res = await req.json();
    const req2 = res.pageProps.fallback.getTabsData.modules[0].tabs;
    const newArray = <any[]>[];
    var first = true;
    for (const key in req2) {
      const item = req2[key];
      if (item.expireMode === "OFF" && item.link.pageType === "GENERAL") {
        newArray.push({
          text: item.link.page.name,
          url: item.link.page.urlPath,
          default: first,
        });
      }
      if (first === true) {
        first = false;
      }
    }
    cachedData = {
      data: newArray,
      timestamp: Date.now(),
    };
    return {
      data: newArray,
      cached: false,
    };
  } catch (e) {
    console.log(e);
    if (cachedData && cacheEnabled) {
      return {
        data: cachedData.data,
        cached: true,
      };
    }
    return {
      error: "INTERNAL_SERVER_ERROR",
    };
  }
});
