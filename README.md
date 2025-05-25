# 新聞解析 / News Analyze

![](https://hackatime-badge.hackclub.com/U087ATD163V/news-analyize)

App Design: [PDF Document](/design.pdf)

Reverse engineering documentation: [about](/about/)

## Before deploying, please know this:
This code is absolutly NOT designed to be spinned up at Vercel or Netlify, it has the scraping system now inside of the main website code, oh also the entire "caching feature" is based in memory, so please don't use those platforms, for Zeabur your cost might be expensive. idk, I haven't tried it yet. The web url: https://news.yuanhau.com is hosted on my own infra, you should too. Please get a server off of yahoo 拍賣 or 蝦皮 to do so.


## Why?

我們使用這個新聞來舉例：

```
朱立倫批政府像希特勒德國在台協會：不應為政治扭曲歷史| 政治 - 中央社 CNA
5/7/2025, 11:17:00 PM
類似新聞:
  - 朱立倫批政府像希特勒德國在台協會：不應為政治扭曲歷史| 政治 - 中央社 CNA
  - 快訊／硬起來！朱立倫回擊德國在台協會：外國政府不該干預各國內政 - 富房網
  - 綠委憂希特勒說釀災 外交部：全力向駐台館處說明 - 經濟日報
  - 「朱立倫道歉」！亂比喻遭德國、以色列譴責 民進黨：賠上台灣國際名譽 - 奇摩新聞
  - 洪聖斐觀點》獨裁餘毒罵人「法西斯」 朱立倫東施效顰共產黨| 政治 - Newtalk新聞
```

你會看到許多觀點，但不知道這些新聞為什麼會寫比較偏見的文章。

## Inspired by

- puter.com
- Perplexity
- Ground.news
- Threads (政治方面)
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

## 如何執行

1. First, rename `.env.example` to `.env` and fill in the blanks.
2. Run `bun install` to install dependencies.
3. Run `bun run createDatabase` to create the database.
4. Run `bun run build` to build the project.
5. Run `bun run preview` to start the preview server.
6. Open `http://localhost:3000` in your browser.

## 有問題? Got questions?
Use GitHub Issues 

------ or ------

Use this form: https://yhw.tw/SaBta
