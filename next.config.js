const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  staticImage: true,
  flexsearch: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
});

module.exports = withNextra({
  i18n: {
    locales: ["en-US", "zh-CN", "es-ES", "fr-FR", "pt-BR", "ja", "ko", "ru"],
    defaultLocale: "en-US",
  },
  redirects: () => {
    return [
      {
        source: "/docs",
        destination: "/docs/getting-started",
        statusCode: 301,
      },
      {
        source: "/advanced/performance",
        destination: "/docs/advanced/performance",
        statusCode: 301,
      },
      {
        source: "/advanced/cache",
        destination: "/docs/advanced/cache",
        statusCode: 301,
      },
      {
        source: "/docs/cache",
        destination: "/docs/advanced/cache",
        statusCode: 301,
      },
      {
        source: "/docs/options",
        destination: "/docs/api",
        statusCode: 301,
      },
      {
        source: "/change-log",
        destination: "/docs/change-log",
        statusCode: 301,
      },
      {
        source: "/blog/swr-1",
        destination: "/blog/swr-v1",
        statusCode: 301,
      },
      {
        source: "/docs",
        destination: "/docs/getting-started",
        statusCode: 302,
      },
      {
        source: "/examples",
        destination: "/examples/basic",
        statusCode: 302,
      },
    ];
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TYPESENSE_HOST: process.env.TYPESENSE_HOST,
    NEXT_PUBLIC_TYPESENSE_PORT: process.env.TYPESENSE_PORT,
    NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL,
    NEXT_PUBLIC_TYPESENSE_SEARCH_KEY: process.env.TYPESENSE_API_KEY,
    NEXT_PUBLIC_AGENCY_SWARM_URL: process.env.AGENCY_SWARM_URL,
    NEXT_PUBLIC_CREATE_CHAT_URL: process.env.CREATE_CHAT_URL,
  },
});