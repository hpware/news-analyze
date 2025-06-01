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
    const articles = [];
    const otherArticles = html("section.moduleContainer div");
    for (const item in otherArticles) {

    }
    return {
      name: newsOrgName,
      description: description,
      logo: logo,
      articles: []
    };
  } catch (e) {
    console.log(e);
    return {
      error: "SERVER_SIDE_ERROR",
    };
  }
});
