export default defineNuxtConfig({
  compatibilityDate: "2025-05-06",
  devtools: { enabled: true },

  routeRules: {
    "/": { redirect: "/home" },
    "/zh_tw": { redirect: "/zh_tw/home" },
    "/desktop": { prerender: true },
    "/go/**": { ssr: true },
    "/find/**": { ssr: true },
    // Send ZIP bombs to troll bots
    "/wp-admin/**": {
      redirect: "https://s3.yhw.tw/data/def-zip-bomb/wp-admin.php.zip",
    },
    "/xmlrpc.php": {
      redirect: "https://s3.yhw.tw/data/def-zip-bomb/xmlrpc.php.zip",
    },
    "/wp-login.php": {
      redirect: "https://s3.yhw.tw/data/def-zip-bomb/wp-login.php.zip",
    },
    "/api/cached/**": { swr: 3600 },
    "/api/news/get": { swr: 3600 },
    "/api/home/lt": { swr: 3600 },
  },

  css: ["~/styles/main.css", "@fontsource-variable/noto-sans-tc"],

  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "motion-v/nuxt",
    "@sentry/nuxt/module",
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
    title: "新聞盲點平台",
    description: "",
  },

  app: {
    buildAssetsDir: "/_assets/",
    head: {
      title: "",
      htmlAttrs: {
        lang: "zh-Hant",
      },
      link: [
        { rel: "dns-prefetch", href: "https://utfs.io" },
        { rel: "icon", type: "image/svg", href: "/favicon.svg" },
      ],
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        {
          name: "keywords",
          content:
            "News Platform, Mini Wikipedia, News Comparison platform, Desktop News Compare system, Destkop Like system, like ground news, built with nuxtjs, open source, 新聞平台, 米你維基百科, 新聞觀點比對平台, 桌面系統, 新聞桌面系統, Ground News, 類似像 Ground News, 開源, python, nuxtjs, vuejs, tailwind, shadcn",
        },
        {
          name: "og:keywords",
          content:
            "News Platform, Mini Wikipedia, News Comparison platform, Desktop News Compare system, Destkop Like system, like ground news, built with nuxtjs, open source, 新聞平台, 米你維基百科, 新聞觀點比對平台, 桌面系統, 新聞桌面系統, Ground News, 類似像 Ground News, 開源, python, nuxtjs, vuejs, tailwind, shadcn",
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
    experimental: {
      openAPI: true,
    },
  },
  /*  scalar: {
    darkMode: true,
    hideModels: false,
    hideDownloadButton: false,
    metaData: {
      title: 'API Documentation by Scalar',
    },
    showSidebar: true,
    pathRouting: {
      basePath: '/scalar',
    },
  },*/
  sentry: {
    sourceMapsUploadOptions: {
      org: "hwtwcc",
      project: "news-analyze",
    },
  },

  sourcemap: {
    client: "hidden",
  },
});
