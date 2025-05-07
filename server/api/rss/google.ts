import Parser from 'rss-parser'
import { HTMLToJSON } from 'html-to-json-parser';


export default defineEventHandler(async (event) => {
  let array = [];
  const parser = new Parser()
  try {
    const feed = await parser.parseURL('https://news.google.com/rss?&hl=zh-TW&gl=TW&ceid=TW:zh-Hant')
    feed.items.forEach(async (item) => {
        const rawRelatedNews = await HTMLToJSON(item.content, true)
        const relatedNews = JSON.parse(rawRelatedNews.replace("ol", ""))
        array.push({
            title: item.title,
            link: item.link,
            date: item.pubDate,
            content: relatedNews
        });
        console.log(item.title);
    })
    return array;
  } catch (error) {
    console.error('Error fetching RSS:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch RSS feed'
    })
  }
})