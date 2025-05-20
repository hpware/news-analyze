import { gunzip } from "zlib";
import { promisify } from "util";

const gunzipAsync = promisify(gunzip);

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

    const buffer = await req.arrayBuffer();
    const decompressed = await gunzipAsync(Buffer.from(buffer));
    const res = JSON.parse(decompressed.toString());
    const data = res.getPageData?.[type];
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function demo() {
  console.log(await getLineTodayData("domestic"));
}
demo();

//export default getLineTodayData;
