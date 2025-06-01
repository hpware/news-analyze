import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    const buildUrl = "https://today.line.me/tw/v3/publisher/" + slug;
    try {
        const req = await fetch(buildUrl)
    } catch (e) {}
})