import * as cheerio from "cheerio";

function findTime(timeText: string) {
  const now = new Date();

  const hourMatch = timeText.match(/(\d+)小時前/);
  const dayMatch = timeText.match(/(\d+)天前/);
  const minuteMatch = timeText.match(/(\d+)分鐘前/);
  if (hourMatch) {
    const hoursAgo = parseInt(hourMatch[1]);
    return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  } else if (dayMatch) {
    const daysAgo = parseInt(dayMatch[1]);
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  } else if (minuteMatch) {
    const minutesAgo = parseInt(minuteMatch[1]);
    return new Date(now.getTime() - minutesAgo * 60 * 1000);
  }
  
  return null;
}

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
  const paragraph = <any[]>[];
  const images = <any[]>[];
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
  const orgAuthorDateData = html("span.entityPublishInfo-meta-info").text()
  const updateMatch = orgAuthorDateData.match(/更新於\s*([^•]+)/);
  const publishMatch = orgAuthorDateData.match(/發布於\s*(.+)$/);
let updatedAt: Date | null = null;
  if (updateMatch) {
    updatedAt = findTime(updateMatch[1].trim());
  }
let publishedAt: Date | null = null;
  if (publishMatch) {
    publishedAt = findTime(publishMatch[1].trim());
  }
  return {
    title: title,
    paragraph: paragraph,
    origin: newsOrgdir,
    author: author,
    images: images,
    updateat: updatedAt,
    publishedat: publishedAt
  };
}

export default lineToday;
