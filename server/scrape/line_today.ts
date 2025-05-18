import * as cheerio from "cheerio";

async function lineToday(slug: string) {
  const url = "https://today.line.me/tw/v2/article/" + slug;
  const fetchPageCode = await fetch(url, {
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
  // 幹 又忘了 await
  const data = await fetchPageCode.text();
  // 加 await? no.
  // AHHH I NEED TO CHANGE TO SOMETHING ELSE.
  const html = cheerio.load(data);
  const title = html("h1.entityTitle")
    .text()
    .replaceAll("\n", "")
    .replace("  ", "");
  const paragraph = [];
  const images = [];
  html("article.news-content")
    .contents()
    .each((i, element) => {
      if (element.type === "tag" && element.tagName === "figure") {
        const imgSrc = html(element).find("img").attr("src");
        if (imgSrc) {
          images.push(imgSrc);
        }
      } else if (element.type === "tag" && element.tagName === "p") {
        const text = html(element).text().trim();
        if (text) {
          paragraph.push(text);
        }
      }
    });
  const newsOrgdir = html("h4.entityPublishInfo-publisher")
    .text()
    .replaceAll("\n", "")
    .replaceAll(" ", "");
  let author = "";
  const authorInfo = html("span.entityPublishInfo-meta-info")
    .text()
    .replace(/更新.*發布.*•/g, "")
    .replaceAll("\n", "")
    .replaceAll(" ", "");
  if (/更新.*發布.*/.test(authorInfo)) {
    author = "未知";
  } else {
    author = authorInfo;
  }
  return {
    title: title,
    paragraph: paragraph,
    origin: newsOrgdir,
    author: author,
    images: images,
  };
}

// Texting on console only!
//console.log(await lineToday("wJyR8Nw"));

export default lineToday;
