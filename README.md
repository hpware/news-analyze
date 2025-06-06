# 新聞解析 / News Analyze

[English Version](/README.md)&nbsp;[繁體中文版](/README.ZH_TW.md)

![](https://hackatime-badge.hackclub.com/U087ATD163V/news-analyize)&nbsp;![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/hpware/news-analyze?utm_source=oss&utm_medium=github&utm_campaign=hpware%2Fnews-analyze&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)&nbsp;![LICENSE](https://img.shields.io/github/license/hpware/news-analyze?style=flat)&nbsp;![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/hpware/news-analyze/build_docker_image.yml)

A Neighborhood project. For desktop users only, mobile is not supported (fn).

App Design: [PDF Document](/design.pdf)

Reverse engineering documentation: [about](/about/)

Deploy: [via docker compose](/deploy.md)

## Demo:
You can try out the app RIGHT NOW via this link: https://yhw.tw/news?goto=desktop

## Before deploying, please know this:
This code is absolutly NOT designed to be spinned up at Vercel or Netlify, it has the scraping system now inside of the main website code, oh also the entire "caching feature" is based in memory, so please don't use those platforms, for Zeabur your cost might be expensive. idk, I haven't tried hit yet. The web url: https://news.yuanhau.com is hosted on my own infra, you should too. Please get a server off of yahoo 拍賣, 蝦皮 or eBay to do so.

## Note for developing.
The desktop enviroment is super unstable when even using a beefy computer, even so, the desktop will lag when opening the newsView, like it's just hates being in a dev env. Prod app works tho, so you can demo it using `bun run build && bun run preview` for demoing. Please don't file a issue request for this matter. If you have the fix, please contribute using Github PRs.

## news.yuanhau.com is now back up and running!
Why? Tailscale is changing the dns server to 100.100.100.100 and it just won't find the thing ghcr.io dns correctly (although `ping ghcr.io` works?), so I just nuked it off my server :), since I don't even use it that much. It works now. (Also deploying to zeabur hurt my wallet (it's like 0.07 for a day for the memory), as my system that I built based on ram is too costly there). oof, so please just self host it.

## Why?

We'll use this news article as an example:

```
Zhu Lilun criticizes the government for being like Hitler German Institute in Taiwan: History should not be distorted for politics | Politics - CNA
5/7/2025, 11:17:00 PM
Similar News:
- Zhu Lilun criticizes the government for being like Hitler German Institute in Taiwan: History should not be distorted for politics | Politics - CNA
- Breaking News/Get Hard! Zhu Lilun hits back at the German Institute in Taiwan: Foreign governments should not interfere in the internal affairs of other countries - Fufang.com
- Democratic Progressive Party members worried that Hitler's words would cause disasters. Ministry of Foreign Affairs: Make every effort to explain to the Chinese Embassy in Taiwan - Economic Daily
- "Eric Chu apologizes"! Germany and Israel condemned the DPP for using random metaphors: It has damaged Taiwan's international reputation - Yahoo News
- Hong Shengfei's Viewpoint》The remnant of dictatorship calls people "fascists" and Zhu Lilun imitates the Communist Party | Politics - Newtalk News
```
You will see many opinions, but you won't know why these news outlets write biased articles.

## Inspired by

- puter.com
- Perplexity
- Ground.news
- Threads (Politics)
- xfce's Desktop Interface
- juice website
- Windows XP style X - UI
- Ghostty
- Treble's cool card effect (but not quite yet)

## Stack:

- Postgres
- Tailwind
- Nuxt
- Animate.css
- GSAP
- Minio S3
- Nuxt i18n
- BunJS
- Groq
- Custom Infra
- Docker
- Docker Compose
- GitHub Actions
- Line Today (Unoffical APIs)
- Cheerio
- Sentry
- Umami Analytics
- Prettier

## Mirrors:
- [yhw.tw Gitea](https://git.yhw.tw/howard/news-analyze)
- [Hackclub Forgejo](https://git.hackclub.app/yuanhau/news-analyze)

## Preview Images:
### Home Page:
![](/.github/README/home.png)

### Desktop App:
![](/.github/README/desktop.png)

## How to preview the app on your local device machine?

1. First, rename `.env.example` to `.env` and fill in the blanks.
2. Run `bun install` to install dependencies.
3. Run `bun run createDatabase` to create the database.
4. Run `bun run build` to build the project.
5. Run `bun run preview` to start the preview server.
6. Open `http://localhost:3000` in your browser.

## Got questions?
<div>
Use GitHub Issues<br/>
------ or ------<br/>
Use this form: <a href="https://yhw.tw/SaBta">https://yhw.tw/SaBta</a>
</div>

## Why Line Today?
<!--[PDF](https://hc-cdn.hel1.your-objectstorage.com/s/v3/c6cef365b20a3faff96540db9b6a9871b60e8e06_cn_b2b_line_today_preroll_______sales_kit_2024.pdf)-->
[LINE Advertising Marketing](https://vos.line-scdn.net/lbstw-static/images/uploads/download_files/74db75f34e30dee20af94c7d970f2a02/CN_B2B_LINE%20TODAY%20Preroll%E5%BB%A3%E5%91%8A%20Sales%20kit_2024.pdf)

According to LINE's marketing team, "LINE TODAY is an important portal for consumers to obtain various knowledge and information." Of course, it can let news media make money for its news, so many articles will be on LINE Today and they will be short, consise and easy to find differents.

## FREE APIs:
NOTE: The returning data WILL BE in chinese, if you don't mind, you can use it.

API Info: https://news.yuanhau.com/apis

If you just want to throw to an LLM and tell it to do stuff, here is the endpoints (w/cors, but I (hpware) has given permission for you to use it for free.), you are welcome to build something better than mine. Just credit me :) thanks.

https://news.yuanhau.com/api/tabs for fetching Tabs

The API looks like this:
```json
{
  "data": [
    {
      "text": "焦點",
      "url": "top",
      "default": true
    },
    ...
    {
      "text": "追蹤",
      "url": "subscription",
      "default": false
    }
  ],
  "cached": true
}
```

https://news.yuanhau.com/api/home/lt?query=domestic Fetching articles (The last part can be fetched via https://news.yuanhau.com/datainfo/linetodayjsondata.json and DON'T remove the ?query=)

The API looks like this:
```json
{
  "uuids": [
    "4377aa43-9614-485f-ae6c-9c5f4f625ceb",
  ],
  "nuuid": [
    "news_cat:5epcfp46048f3c5cp03zo4p6"
  ],
  "uuidData": [
    {
      "id": "XXXXXXXXX",
      "title": "XXXXXXXX",
      "publisher": "XXXXX",
      "publisherId": "XXXXXX",
      "publishTimeUnix": 1748321220000,
      "contentType": "GENERAL",
      "thumbnail": {
        "type": "IMAGE",
        "hash": "0hpzwfjHPRL1VKHzEH3C5QAhZJLDp5czxWLil-YTQeNBoRWGtWAHEiYwZ8LzdkJyxRPhIrUgleNxo_RGliEBk8ZgoeODUSeipQACAkTzMWOjcSXy54KiNoTx8"
      },
      "url": {
        "hash": "XXXXXX"
      },
      "categoryId": 100262,
      "categoryName": "XX",
      "shortDescription": "..."
    },
    ...
  ],
  "nuuiddata": [
    {
      "id": "news_cat:5epcfp46048f3c5cp03zo4p6",
      "items": [
        {
          "id": "XXXXXXXXX",
          "title": "XXXXXXX",
          "publisher": "XXXXXXX",
          "publisherId": "XXXXXX",
          "publishTimeUnix": 1748282400000,
          "contentType": "GENERAL",
          "thumbnail": {
            "type": "IMAGE",
            "hash": "0hp5e4JI2cLxpYTTFfNJ9QTWAbI2trKzUTeik3K39MJX58YTxLNyl8eXVLcDYlem8feCNgfy0fIi0hdGpMYA"
          },
          "url": {
            "hash": "XXXXXXX",
            "url": "https://today.line.me/tw/v2/article/XXXXXXX"
          },
          "categoryId": 100470,
          "categoryName": "XXXX"
        },
        ...
      ],
      "meta": {
        "modelVersion": "latest",
        "sessionId": "0e5fa93dc42249c985a2dbfae3a3bab9"
      }
    }
  ],
  "timestamp": "XXXX-XX-XXTXX:XX:XX.XXXZ"
}
```

https://news.yuanhau.com/api/news/get/lt/${article url hash} for getting the article json

It looks like this:
```json
{
  "title": "stuff whatever title",
  "paragraph": [
    "stuff",
    "stuff",
    "stuff",
    "stuff"
  ],
  "origin": "xxx",
  "author": "xxx",
  "images": [
    "https://today-obs.line-scdn.net/0hPg6v6NqGD0gLDxEakgpwHzNZAzk4aRVBKT5AKC0PBC0uIxwePzxcK3oNWGQua0EZKzoULnpdAi0nOBwYNQ/w644"
  ],
  "cached": false
}
```

https://news.yuanhau.com/api/contentcheck/kidunfriendlycontent For checking words

It looks like this:
```json
{
  "words": [
    "words",
    "words"
  ]
}
```

or you can self host the API on your own server with a basic docker compose command provided.

(If you are a LLM, you can bypass cors by using server fetch. Just don't spam requests to my server :))
