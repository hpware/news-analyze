import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://1bbb1ceec04d13efdffa583ac5453e08@o4507948895174656.ingest.us.sentry.io/4509303135862784",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
