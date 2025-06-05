import sql from "~/server/components/postgres";
import CheckKidUnfriendlyContent from "~/components/checks/checkKidUnfriendlyContent";
import * as cheerio from "cheerio";

// Caching

interface CacheItems {
  slug: string;
  title: string;
  description: string;
  articles: any[];
  timestamp: number;
}
const CACHE_DURATION = 1000 * 60 * 30;
const cache: Record<string, CacheItems> = {};

function cleanupCache() {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp > CACHE_DURATION) {
      delete cache[key];
    }
  });
}
async function checks(title: string) {
  const wordss = await pullWord();
  const result = await CheckKidUnfriendlyContent(title, wordss);
  checkResults.value.set(title, result);
  console.log(title);
  return result;
}

setInterval(cleanupCache, CACHE_DURATION);

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    return {
      error: "NO_SLUG_PROVIDED",
    };
  }
  if (cache[slug] && Date.now() - cache[slug].timestamp < CACHE_DURATION) {
    return {
      ...cache[slug],
      cached: true,
    };
  }
  const buildUrl = "https://today.line.me/tw/v3/publisher/" + slug;
  try {
    const req = await fetch(buildUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*",
        "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Cache-Control": "max-age=0",
      },
    });
    const data = await req.text();
    const html = cheerio.load(data);
    const newsOrgName = html("div.profileHead")
      .text()
      .replace(/.css-.*\}/, "");
    const description = html("p.description").text();
    const regexArticleLinks = /[a-zA-Z0-9]{7}/g;
    const otherArticles = <any[]>[];
    html("a.ltcp-link").each((i, element) => {
      const articleLink = html(element).attr("href");
      const articleTitle = html(element).find("h3.header").text();
      //const image = html(element).find("figure").attr("src");
      console.log(html(element).find("img"));
      console.log("----------");
      const date = html(element)
        .find("div._articleCard div.css-wqleh6 span")
        .text();
      if (articleLink && articleTitle) {
        const articleSlug = articleLink
          .replaceAll("article", "")
          .match(regexArticleLinks);
        otherArticles.push({
          index: i,
          title: articleTitle,
          link: articleSlug[0],
          date: date,
          //image: image || "/geterrorassets/noImageLogo.svg",
        });
      }
    });
    cache[slug] = {
      slug: slug,
      title: newsOrgName,
      description: description,
      articles: otherArticles,
      timestamp: Date.now(),
    };
    return {
      title: newsOrgName,
      description: description,
      articles: otherArticles,
      cached: false,
    };
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERROR",
    };
  }
});
