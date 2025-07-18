# 新聞解析 / News Analyze

NOTE: 大多數的資訊都還是會會在英文版，中文版就是我想翻譯的時候寫的 (已經簡短)

[English Version](/README.md)&nbsp;[繁體中文版](/README.ZH_TW.md)

![](https://hackatime-badge.hackclub.com/U087ATD163V/news-analyize)&nbsp;![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/hpware/news-analyze?utm_source=oss&utm_medium=github&utm_campaign=hpware%2Fnews-analyze&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)&nbsp;![LICENSE](https://img.shields.io/github/license/hpware/news-analyze?style=flat)&nbsp;![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/hpware/news-analyze/build_docker_image.yml)

一個 Neighborhood 專案。 現在只提供電腦的版本，手機版的目前不支援。

UI設計圖: [PDF 檔案](/design.pdf)

Reverse engineering 文檔: [about](/about/)

部署（英文檔案）: [via docker compose](/deploy.md)

## Demo:
正式版： https://yhw.tw/news

測試版： https://newsbeta.20090526.xyz (對我就是買了 一堆數字.xyz 的人)

## 在部署之前，請先知道:
此程式碼絕對不是為在 Vercel 或 Netlify 上啟動而設計的，它現在在主網站程式碼中具有crawling，而且整個「快取功能」都基於Ram，所以請不要使用這些平台，對於 Zeabur 來說，您的成本一定會比較貴一點。網址：https://news.yuanhau.com 託管在我自己的infra上，你也應該這麼做。可以在Yahoo拍賣、蝦皮取得伺服器來執行這個程式。

## 如果要開發，你需要
- 一個 Postgres 資料庫 (你可以用 Zeabur 跑開發用資料庫，可以用我的 [優惠連結(?](https://zeabur.com/referral?referralCode=hpware)，你可以拿到大約150塊的試用金額
- 一個 Groq 的 API

## 為什麼?

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

## 預覽網站系統：
### 首頁:
![](/.github/README/home.png)

### 桌面程式:
![](/.github/README/desktop.png)

## 如何在我的電腦上運行測試環境?

1. 第一, 把 `.env.example` 改名到 `.env` 並填空白處
2. 使用 `bun install` 來安裝需要的套件。
3. 跑 `bun run createDatabase` 來創建資料庫
4. 跑 `bun run build` 來 build 程式
5. 跑 `bun run preview` 來開 preview 的伺服器程式
6. 在瀏覽器打開 `http://localhost:3000` 就可用了

## 有問題?
<div>
可以使用 GitHub Issues<br/>
------ 或 ------<br/>
使用這個表單:<a href="https://yhw.tw/SaBta">https://yhw.tw/SaBta</a>
</div>

## 為什麼使用 Line Today?
<!--[PDF](https://hc-cdn.hel1.your-objectstorage.com/s/v3/c6cef365b20a3faff96540db9b6a9871b60e8e06_cn_b2b_line_today_preroll_______sales_kit_2024.pdf)-->
[LINE 官方連結](https://vos.line-scdn.net/lbstw-static/images/uploads/download_files/74db75f34e30dee20af94c7d970f2a02/CN_B2B_LINE%20TODAY%20Preroll%E5%BB%A3%E5%91%8A%20Sales%20kit_2024.pdf)

在 LINE 自己的口中 「LINE TODAY是消費者獲取各式知識資訊的重要入⼝」，當然可以讓新聞媒體給他新聞賺錢，所以很多Article多會在 LINE Today 上

## 免費的 API!
API 資訊: https://news.yuanhau.com/apis

如果您只是想將其交給ＡＩ並叫他幫你做網站，這裡是可以免費使用的 API，歡迎你做比我的更好的東西。請給我credit就好ㄌ：）

[File](https://github.com/hpware/news-analyze?tab=readme-ov-file#free-apis)
