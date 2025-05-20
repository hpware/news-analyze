# Scraping Line Today's home page system

This took me some time, but they use a fancy system for pulling news data.

## Endpoint on news.yuanhau.com aka this repo (Cached results)

### /api/home/uuid_lt/action?query=${query}
Fetches the uuid in each listings of the query

### /api/home/lt/${query}
Fetches the uuid and returns back with the news

## Main endpoint
For local Taiwan news they use this url: https://today.line.me/_next/data/v1/tw/v3/tab/domestic.json?tabs=domestic

From _next? I thought that is static? I mean it maybe is, it is just providing with the URLs that the client will be fetching to the server, which is a bit fun.

Here is a JSON snippet:
```json
{
  "id": "the-news-id",
  "type": "HIGHLIGHT",
  "containerStyle": "Header",
  "name": "國內話題：topic",
  "source": "LISTING",
  "header": {
    "title": "the top title here",
    "hasCompositeTitle": false,
    "subTitle": "the news subtitle here"
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
  "id": "news-id",
  "title": "news-title",
  "publisher": "news-publisher",
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
  "shortDescription": "The article's short description"
},
```
The url hash is just what we needed to use my scraper :D

You can query it by using: https://news.yuanhau.com/api/news/get/lt/8nlkYeV (Also videos are in the list, so avoid that) or just try this  https://today.line.me/tw/v2/article/8nlkYeV

and that's it, I've bypassed Line's attempt to block people like me. :)
