import JSSoup from "jssoup";
//import cheerio from "cheerio";

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
  const soup = new JSSoup(data, false);
  const titlesoup = soup.find("h1", "entityTitle");
  const title = titlesoup.text.replaceAll("\n", "");

  const article = soup.find("article", "news-content");
  const paragraph = article.text;
  return {
    title: title,
    paragraph: paragraph,
  };
}

export default lineToday;
