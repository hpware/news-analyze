<script setup lang="ts">
import {
  ArrowBigRightDashIcon,
  BadgeCheckIcon,
  BadgeXIcon,
  PanelTopIcon,
  RssIcon,
  NewspaperIcon,
  BotMessageSquareIcon,
  CombineIcon,
} from "lucide-vue-next";
const apis = [
  {
    icon: ArrowBigRightDashIcon,
    apiroute: "/shortforward",
    name: "A Simple url forwarder.",
    content:
      "This is maly used for yhw.tw/news, which is a super simple redirection tool for easy redirecting.",
    caching: false,
    openAccess: true,
  },
  {
    icon: PanelTopIcon,
    apiroute: "/api/tabs",
    name: "Get LINE Today Tabs",
    content: "Using LINE Today as a source for getting tabs & caching results.",
    caching: true,
    openAccess: true,
  },
  {
    icon: RssIcon,
    apiroute: "/api/home/lt",
    name: "Get the news feed of LT",
    content:
      "This endpoint requires ?query=, and you can go the the /api/tabs to find the query.",
    caching: true,
    openAccess: true,
  },
  {
    icon: NewspaperIcon,
    apiroute: "/api/news/get/lt/[slug]",
    name: "Get the news article from LT",
    content:
      "This endpoint requires the slug to be filled in, in order to get it to work.",
    caching: true,
    openAccess: true,
  },
  {
    icon: BotMessageSquareIcon,
    apiroute: "/api/ai/chat/[slug]",
    name: "A Chating API",
    content:
      "This is for the desktop app & talk about news articles. Using Groq's free tier.",
    caching: false,
    openAccess: false,
  },
  {
    icon: CombineIcon,
    apiroute: "/api/ai/summarize/[slug]",
    name: "A News Summarize using AI",
    content: "This is also powered by the Groq API (the free tier of course).",
    caching: false,
    openAccess: true,
  },
];
</script>
<template>
  <div class="h-4"></div>
  <div class="justify-center align-center text-center flex flex-col">
    <h1 class="text-4xl text-bold m-2">APIs</h1>
    <div
      class="items flex flex-row flex-wrap gap-2 justify-center align-center"
    >
      <div
        class="px-10 bg-gray-900/70 w-[400px] h-[300px] group rounded-xl hover:-translate-y-1 shadow-lg hover:shadow-sky-600/90 backdrop-blur-sm border border-gray-800 hover:border-sky-600/70 transition-all duration-700 justify-center align-middle flex flex-col text-left"
        v-for="item in apis"
      >
        <component
          :is="item.icon"
          class="w-8 h-8 text-white group-hover:text-sky-500 transition-colors duration-300"
        />
        <h1 class="text-2xl text-bold">{{ item.name || "N/A" }}</h1>
        <h2>API: {{ item.apiroute }}</h2>
        <p class="text-sm">{{ item.content || "N/A" }}</p>
        <div class="gap-0 m-1">
          <div class="text-md flex flex-row gap-2 text-center p-2">
            Caching:
            <BadgeCheckIcon
              v-if="item.caching"
              class="w-7 h-7 p-1 group-hover:text-green-300 transition-all duration-200"
            />
            <BadgeXIcon
              v-else
              class="w-7 h-7 p-1 group-hover:text-red-400 transition-all duration-200"
            />
          </div>
          <div class="text-md flex flex-row gap-2 text-center p-2">
            Open Access:
            <BadgeCheckIcon
              v-if="item.caching"
              class="w-7 h-7 p-1 group-hover:text-green-300 transition-all duration-200"
            />
            <BadgeXIcon
              v-else
              class="w-7 h-7 p-1 group-hover:text-red-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-4"></div>
</template>
