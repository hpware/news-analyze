export default defineNuxtConfig({
  compatibilityDate: "2025-05-06",
  devtools: { enabled: true },
  routeRules: {
    "/": { redirect: "/home" },
    "/zh_tw": { redirect: "/zh_tw/home" },
    "/api/rss/**": { swr: 3600 },
    "/go/**": { ssr: true },
    "/find/**": { ssr: true },
  },
  css: ["~/styles/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxtjs/robots",
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
  ],
  i18n: {
    defaultLocale: "en",
    vueI18n: "./i18n.config.ts",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "zh_tw", name: "Chinese Tradional", file: "zh-tw.json" },
    ],
  },
  site: {
    url: "https://news.yuanhau.com",
    title: "BlindSpec",
    description: "",
  },
  app: {
    head: {
      title: "",
      htmlAttrs: {
        lang: "zh-Hant",
      },
      link: [
        { rel: "dns-prefetch", href: "https://utfs.io" },
        { rel: "dns-prefetch", href: "https://s3.yhw.tw" },
      ],
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        {
          name: "keywords",
          content:
            "News Platform, Mini Wikipedia, News Comparison platform, 新聞平台, 米你維基百科, 新聞觀點比對平台",
        },
        {
          name: "og:keywords",
          content:
            "News Platform, Mini Wikipedia, News Comparison platform, 新聞平台, 米你維基百科, 新聞觀點比對平台",
        },

        { name: "author", content: "@hpware on GitHub" },
        { name: "og:author", content: "@hpware on GitHub" },

        {
          name: "author:email",
          content: "public+newscompareauthor@yuanhau.com",
        },
        {
          name: "og:author:email",
          content: "public+newscompareauthor@yuanhau.com",
        },

        { name: "type", content: "website" },
        { name: "og:type", content: "website" },

        { name: "locale", content: "zh_TW" },
        { name: "og:locale", content: "zh_TW" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "copyright", content: "yh" },
      ],
      script: [
        {
          src: "https://data.yuanhau.com/script.js",
          "data-website-id": "19c3756c-c9ac-489d-b9f0-0bb62579ed82",
          defer: true,
        },
      ],
      noscript: [
        {
          innerHTML:
            "Sorry, but this website requires Javascript to function correctly.",
          tagPriority: "critical",
        },
      ],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }, // Add your content paths here
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  nitro: {
    preset: "bun", // This is dumb.
  },
});
