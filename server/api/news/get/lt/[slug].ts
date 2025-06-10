import lineToday from "~/server/scrape/line_today";
import sql from "~/server/components/postgres";
import { v4 as uuidv4 } from "uuid";

interface CacheItems {
  title: string;
  paragraph: string[];
  origin: string;
  author: string;
  images: string[];
  cached: boolean;
  articleId: string;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60;

const cache: Record<string, CacheItems> = {};

function cleanupCache() {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp > CACHE_DURATION) {
      delete cache[key];
    }
  });
}

setInterval(cleanupCache, CACHE_DURATION);

function cleanUpSlug(orgslug: string) {
  let slug = orgslug.trim();
  const validSlugRegex = /^[a-zA-Z0-9-]+$/;
  if (!validSlugRegex.test(slug)) {
    throw new Error("Invalid slug format");
  }
  return slug;
}

// Archive articles. For future use?
async function storeArticlesIfItDoesNotExists(data, RequestId) {
  const checkDataIsInDatabase = await sql`
    SELECT * FROM news_articles
    WHERE jsondata = ${data}
    `;
  if (checkDataIsInDatabase.length === 0) {
    return;
  }
  const storeData = await sql`
    INSERT INTO news_articles (uuid, article_id, jsondata)
    VALUES (${uuidv4()}, ${RequestId}, ${data})
    `;
  console.log(storeData);
  return;
}

export default defineEventHandler(async (event) => {
  const translateQuery = getQuery(event).translate;
  const translate = translateQuery === "true" ? true : false;
  console.log(translate);
  const slug = getRouterParam(event, "slug");
  const cleanSlug = cleanUpSlug(slug);
  if (
    cache[cleanSlug] &&
    Date.now() - cache[cleanSlug].timestamp < CACHE_DURATION
  ) {
    return {
      ...cache[cleanSlug],
      cached: true,
    };
  }

  try {
    const data = await lineToday(cleanSlug);
    storeArticlesIfItDoesNotExists(data, cleanSlug);
    cache[cleanSlug] = {
      ...data,
      timestamp: Date.now(),
    };
    return {
      ...data,
      cached: false,
    };
  } catch (e) {
    if (cache[cleanSlug]) {
      return {
        ...cache[cleanSlug],
        cached: true,
      };
    }
    throw createError({
      statusCode: 500,
      message: "SERVER_SIDE_ERROR",
    });
  }
});
