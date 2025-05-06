const { t } = useI18n();
export default defineNuxtConfig({
  compatibilityDate: '2025-05-06',
  devtools: { enabled: true },
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
})