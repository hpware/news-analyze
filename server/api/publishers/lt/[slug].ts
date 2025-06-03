import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
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
    const logo =
      html("div.editor div figure img").attr("srcset") ||
      html("div.editor div figure img").attr("src") ||
      "";
    const bgImage = html("figure.keyVisual img").attr("srcset") || "";
    const articles = [];
    const regexArticleLinks = /[a-zA-Z0-9]{7}/g;
    const otherArticles = <any[]>[];
    html("a.ltcp-link").each((i, element) => {
      const articleLink = html(element).attr("href");
      const articleTitle = html(element).find("h3.header").text();
      const date = html(element)
        .find("div._articleCard div.css-wqleh6 span")
        .text();
      if (articleLink && articleTitle) {
        const articleSlug = articleLink.matchAll(regexArticleLinks);
        otherArticles.push({
          index: i,
          title: articleTitle,
          link: articleSlug,
          date: date,
        });
      }
    });
    return {
      name: newsOrgName,
      description: description,
      logo: logo,
      articles: otherArticles,
    };
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERROR",
    };
  }
});
