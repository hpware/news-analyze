// Check /about/scraping_line_today_home.md for more info or https://news.yuanhau.com/datainfo/linetodayjsondata.json
async function getLineTodayData(type: string) {
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
    const req2 = res.pageProps.fallback["getPageData,domestic"].modules;
    const req3 = [];
    req2.forEach((key) => {
      const listings = key.listings;
      if (Array.isArray(listings)) {
        listings.forEach((listing) => {
          if (listing && listing.id) {
            req3.push(listing.id);
          }
        });
      } else if (listings && listings.id) {
        req3.push(listings.id);
      }
    });
    return req3;
  } catch (e) {
    console.log(e);
  }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  return await getLineTodayData(slug);
});
