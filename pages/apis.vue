<script setup lang="ts">
const apis = [
  {
    apiroute: "/shortforward",
    name: "A Simple url forwarder.",
    content:
      "This is maly used for yhw.tw/news, which is a super simple redirection tool for easy redirecting.",
    caching: false,
  },
  {
    apiroute: "/api/tabs",
    name: "Get LINE Today Tabs",
    content: "Using LINE Today as a source for getting tabs & caching results.",
    caching: true,
  },
  {
    apiroute: "/api/home/lt",
    name: "Get the news feed of LINE Today",
    content:
      "This endpoint requires ?query=, and you can go the the /api/tabs to find the query.",
    caching: true,
  },
  {
    apiroute: "/api/news/get/lt/[slug]",
    name: "Get the news article using node-fetch & cheerio",
    content:
      "This endpoint requires the slug to be filled in, in order to get it to work.",
    caching: true,
  },
  {
    apiroute: "/api/ai/chat/[slug]",
    name: "",
    content: "",
    caching: false,
  },
  {
    apiroute: "/api/ai/summarize/[slug]",
    name: "",
    content: "",
    caching: false,
  },
];
</script>
<template>
  <div
    class="justify-center align-center text-center absolute inset-0 flex flex-col"
  >
    <h1 class="text-4xl text-bold">APIs</h1>
    <div class="items flex flex-row flex-wrap">
      <div class="item group" v-for="item in apis">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
