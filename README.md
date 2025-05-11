# 新聞解析 / News Analyze

![](https://hackatime-badge.hackclub.com/U087ATD163V/news-analyize)

App Design: [Freeform](https://www.icloud.com/freeform/026AxB798cViZ9jJ2DkNsXUCQ#Untitled_5)

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
- 台灣新聞
- Threads

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
- Python
- BeautifulSoup4

## Folder Structure

```
├── .github/
│   └── workflows/
├── .nuxt/
├── .output/
├── components/
│   ├── app/
│   │   └── newsOrgAbout/
│   └── ui/
├── i18n/
├── layouts/
├── lib/
├── pages/
│   └── app/
├── public/
├── scraping/
├── server/
│   ├── api/
│   │   └── objectstorage/
│   ├── components/
│   └── routes/
├── styles/
├── app.vue
├── createDatabase.ts
├── nuxt.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 如何執行

1. First, rename `.env.example` to `.env` and fill in the blanks.
2. Run `bun install` to install dependencies.
3. Run `bun run createDatabase` to create the database.
4. Run `ps1 clone-env.ps1` or `bash clone-env.sh` to clone the `.env` file to the `scraping` folder.
5. Run `bun run build` to build the project.
6. Run `bun run preview` to start the preview server.
7. Open `http://localhost:3000` in your browser.

### For scaping
First, Run `ps1 clone-env.ps1` or `bash clone-env.sh` to clone the `.env` file to the `scraping` folder, then cd into the `scraping` folder. Run `python main.py` to start scraping in Google News.