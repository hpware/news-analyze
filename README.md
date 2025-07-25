# News Analyze

[English Version](/README.md)&nbsp;[繁體中文版](/README.ZH_TW.md)

![](https://hackatime-badge.hackclub.com/U087ATD163V/news-analyize)&nbsp;![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/hpware/news-analyze?utm_source=oss&utm_medium=github&utm_campaign=hpware%2Fnews-analyze&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)&nbsp;![LICENSE](https://img.shields.io/github/license/hpware/news-analyze?style=flat)&nbsp;![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/hpware/news-analyze/build_docker_image.yml)&nbsp;

![nhbadge](https://img.shields.io/badge/made%20for%20neighborhood-bf8f73?style=for-the-badge&logo=hackclub&logoColor=ffffff)

A Neighborhood project. For desktop users only, mobile is not supported (fn).

App Design: [PDF Document](/design.pdf)

Reverse engineering documentation: [about](/about/)

Deploy: [via docker compose](/deploy.md)

Goals before the next devlog: [Markdown file](/GOALS_BEFORE_NEXT_DEVLOG.md)

Video Guide: [YouTube](https://youtu.be/8P3qgVm6m6g)

## Demo:
Production (Latest Docker Image): https://yhw.tw/news

Beta (Beta Docker Image): https://newsbeta.20090526.xyz

## Video Guide

https://github.com/user-attachments/assets/29414c5d-3b2f-420d-93c0-95c14a15bbb7

## Notes:
The enviroment vars are stored in the database, which is cursed, I know, but this is the only way to let the system access new envs sent by the user, so if you are trying to spin up a instence of this app you MUST put the postgres url in the .env & create a table using beekeeper studio (my choice for SQL editing, you can choose whatever you like), and after that you can create the entire database by using this api call, https://<<your_domain>>/api/create_database in your browser.
```sql
    CREATE TABLE IF NOT EXISTS global_vars (
    NAME TEXT PRIMARY KEY NOT NULL,
    VAR TEXT NOT NULL
    );
    INSERT INTO global_vars(name, var)
    VALUES ('groq_api_key', '<<YOUR_API_KEY_HERE>>');
    INSERT INTO global_vars(name, var)
    VALUES ('password_hash_salt', '<<YOUR_PASSWORD_SALT_HERE>>');
```
Replace `<<YOUR_API_KEY_HERE>>` with your actual api key, and also replace `<<YOUR_PASSWORD_SALT_HERE>>` with a random salt you get by running this command on your Mac/Linux device (Windows idk) `openssl rand -base64 48`.

## Issues:
### Onboarding:
Onboarding is a must for most people that are using the app for the first time, but I want to do to via a non-video like system, however implementing the function in a already large repo is kinda hard. So I just add a basic video onboarding system.

### Login system:
The current login DOES NOT see if you're logged in or not, it just prompts if the user wants to login or not. This NEEDS to be fixed

### Windows with the wraping function `<BlurPageBeforeLogin></BlurPageBeforeLogin>`:
The wrapping function, `<BlurPageBeforeLogin></BlurPageBeforeLogin>`, is currently running a static value for testing use only, so for pages that reqire you to be logged in WILL NOT work for (even if you logged in). It is just a value in the blurPageBeforeLogin.vue function `if (true)`

### Server Downtime
Use https://status.yhw.tw/ for checking down time, most of the time it will be up, but sometimes it just won't updated to the latest feature & update.

### Scraping restrictions:
As LINE Today only loads & put the image file via JS in the browser, node-fetch is not working (yes, this platform uses node-fetch as the only way to scrape stuff). If LINE today became more problematic of this platform, those APIs will no longer work & most of the things will just not work, as it requires LINE Today to NOT patch these node-fetch things.

### Developing enviroment lagging:
The desktop app alone has 700+ lines of code, and compiling on the fly is really slow & can really lag your computer (like my Macbook, which has lagged the entire time I'm trying to develop the app.).

### Translating system:
A few pages now contains translations, like the news, aboutNewsOrg and newsView pages. This project currently is using Google Translate. However, muiti translate platform support is coming soon™ (If you login with your account). The translations are not accrate at all, like something that should be `I just want to write about sports` becomes `I just want to write`, like bro, what is even that?

### Deploying:
This code is absolutly NOT designed to be spinned up at Vercel or Netlify, it has the scraping system now inside of the main website code, oh also the entire "caching feature" is based in memory, so please don't use those platforms, for Zeabur your cost might be expensive. idk, I haven't tried hit yet. The web url: https://news.yuanhau.com is hosted on my own infra, you should too. Please get a server off of yahoo 拍賣, 蝦皮 or eBay to do so.

### The API returning outdated data from more than 5+ years:
Here is the GitHub Issue: https://github.com/hpware/news-analyze/issues/2

### When using the desktop in the dev env it pops up an error
![](/.github/README/error1.png)

For some reasons, Nuxt's dev env prev does not display this error, but with the newer ones, it started displaying this error, please run `./wipedev.sh` or `./wipedev.bat` and restart the dev server. (And this is only a temp fix, I have no idea how can I fix this, if you have a fix, please submit a PR, thx.)

## Stack:

- Postgres
- Tailwind
- Nuxt
- Animate.css
- GSAP
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
