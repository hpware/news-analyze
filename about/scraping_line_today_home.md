# Scraping line today home

This took me some time, but they use a fancy system for pulling news data.

## Main endpoint
For local Taiwan news they use this url: https://today.line.me/_next/data/v1/tw/v3/tab/domestic.json?tabs=domestic

From the _next? I thought that is static? I mean it maybe is, it is just providing with the URLs that the client will be fetching to the server, which is a bit fun.

Here is a JSON snippet:
```json
{
  "id": "682b0cef1b1269f8dec93e60",
  "type": "HIGHLIGHT",
  "containerStyle": "Header",
  "name": "國內話題：新北重大車禍",
  "source": "LISTING",
  "header": {
    "title": "新北重大死傷車禍",
    "hasCompositeTitle": false,
    "subTitle": "一輛小客車19日下午撞上放學人群，造成多名學童、大人送醫，至少3死10多傷，肇事的78歲男子當場昏迷。"
  },
  "listings": [
    {
      "id": "1feef7d2-3acc-495d-becd-3ef4de6a92ce",
      "offset": 0,
      "length": 10
    }
  ]
},
```

We can ignore everything else, other than the strange UUID in the json. Well, this is the key we need to fetch their api 🤩

## Fetch news URLs

Here is the fancy URL:
`https://today.line.me/api/v6/listings/{the-uuid-you-got-in-the-listings-json-file}/?country=tw&offset=0&length=24`

This api can be used for fetching the news from them, however, there is an issue, the max length is only just 24 (yes, I tried it only can return 24 when requesting for 1000)


And viewing the JSON, oh would you look at that.
```JSON
{
  "id": "262862833",
  "title": "派駐芬蘭遭白委扯焦慮症 林昶佐現身喊話",
  "publisher": "太報",
  "publisherId": "101366",
  "publishTimeUnix": 1747670221000,
  "contentType": "GENERAL",
  "thumbnail": {
    "type": "IMAGE",
    "hash": "0hvoq7de5NKUBMTjcMHM5WF3QYJTF_KDNJbixudj4ddXJnYm4ecX16Iz0edWwydjsTbH9vdm5IJ3EyKjtBeA"
  },
  "url": {
    "hash": "8nlkYeV"
  },
  "categoryId": 100262,
  "categoryName": "國內",
  "shortDescription": "前立委林昶佐（右二）將出任駐芬蘭代表，民眾黨立委林憶君卻質疑罹患焦慮症不適合去北歐。翻攝畫面前立委林昶佐將接任駐芬蘭代表，民眾黨立委林憶君今（5/19）質詢指出，林林昶佐曾患焦慮症，北歐國家日常短，病症容易發作，質疑是否適合。林昶佐晚間現身直播節目，向病友喊話，要對自己有信心，「絕對可以回復到正常生活，包括工作」。林憶君指出，1990年芬蘭是全球自殺率最高國家，而且北歐國家的日照很短，病症容易發作..."
},
```
The url hash is just what we needed to use my scraper :D

You can query it by using: https://news.yuanhau.com/api/news/get/lt/8nlkYeV (Also videos are in the list, so avoid that) or just try this  https://today.line.me/tw/v2/article/8nlkYeV

and that's it, I've bypassed Line's attempt to block people like me. :)
