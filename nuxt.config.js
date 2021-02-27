require("dotenv").config();

module.exports = {
  server: {
    port: 5000,
    host: "localhost",
  },

  env: {
    tinyKey: process.env.TINY_KEY,
  },

  head: {
    htmlAttrs: { lang: "ru" },
    meta: [
      { charset: "utf-8" },
      { name: "theme-color", content: "#000000" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preload", href: "/assets/fonts/4.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
      { rel: "preload", href: "/assets/fonts/7.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
    ],
  },

  telemetry: false,
  loading: false,
  loadingIndicator: false,
  components: true,
  router: { prefetchLinks: false },

  css: ["@/assets/style.scss"],

  plugins: [{ src: "~plugins/vee-validate", mode: "client" }],

  buildModules: ["@nuxtjs/date-fns"],

  modules: ["@nuxtjs/axios", "@nuxtjs/auth", "@nuxtjs/toast", "@nuxtjs/pwa"],

  dateFns: { locales: "ru", defaultLocale: "ru", methods: ["parseISO", "format"] },

  pwa: {
    manifest: {
      name: "free-audit.ru",
      lang: "ru",
      theme_color: "#000000",
      description: "Бесплатный аудит сайта",
    },
  },

  axios: { proxy: true },
  proxy: { "/api/": `${process.env.BASE_URL}` },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/auth/login",
            method: "post",
            propertyName: "token",
          },
          logout: { url: "/api/auth/logout", method: "post" },
          user: { url: "/api/auth/user", method: "get", propertyName: "user" },
        },
      },
    },
  },

  build: {
    transpile: ["vee-validate/dist/rules"],
  },
};
