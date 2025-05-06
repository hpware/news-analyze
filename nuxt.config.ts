import tailwindcss from '@tailwindcss/vite';
export default defineNuxtConfig({
  compatibilityDate: '2025-05-06',
  devtools: { enabled: true },
  routeRules: {
    "/": { redirect: "/home"},
    "/zh_tw": { redirect: "/zh_tw/home"},
  } ,     
  css: ['~/styles/tailwind.css'],
  modules: [
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/seo',
    '@nuxtjs/i18n'
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh_tw', name: 'Chinese Tradional', file: 'zh-tw.json' },
    ]
  },
  site: {
    url: "https://news.yuanhau.com",
    title: "BlindSpec",
    description: "",
  },
  app: {
    head: {
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "og:author", content: "@hpware on GitHub" },
        { name: "og:author:email", content: "public+newscompareauthor@yuanhau.com" },
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
})