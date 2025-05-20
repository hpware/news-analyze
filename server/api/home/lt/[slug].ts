// Check /about/scraping_line_today_home.md for more info or https://news.yuanhau.com/datainfo/linetodayjsondata.json
interface CacheItem {
  data: string[];
  timestamp: number;
}
const cache: Record<string, CacheItem> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour

async function getUUID(orgtype: string) {
  const type = orgtype.toLowerCase();
  if (cache[type] && Date.now() - cache[type].timestamp < CACHE_DURATION) {
    console.log("Serving from cache for type:", type);
    return cache[type].data;
  }

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
    const req2 = res.pageProps.fallback[`getPageData,${type}`].modules;
    const req3 = [];
    req2.forEach((key) => {
      const listings = key.listings;
      if (Array.isArray(listings)) {
        listings.forEach((listing) => {
          if (listing && listing.id) {
            req3.push(listing.id);
          }
        });
      }
    });

    cache[type] = {
      data: req3,
      timestamp: Date.now(),
    };

    return req3;
  } catch (e) {
    console.log(e);
    if (cache[type]) {
      console.log("Serving expired cache due to error");
      return cache[type].data;
    }
    return [];
  }
}

function filterUUIDs(ids: string[]): string[] {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return ids.filter((id) => uuidPattern.test(id));
}

export default defineEventHandler(async (event) => {
  try {
    const data = await getUUID(String(query.query));
    const validUUIDs = filterUUIDs(data || []);
    const slug = getRouterParam(event, "slug");
    const urlBuild = "/api/home/uuid_lt/action?query=" + String(slug.trim());
    const articleArray = [];
    const { data: res } = await useFetch(urlBuild);
    return res;
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERROR",
    };
  }
});
