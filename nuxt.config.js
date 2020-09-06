require("dotenv").config();

module.exports = {
  mode: "universal",

  server: {
    port: 5000,
    host: "localhost"
  },

  env: {
    baseUrl: process.env.BASE_URL,
    tinyKey: process.env.TINY_KEY
  },

  head: {
    htmlAttrs: { lang: "ru" },
    meta: [
      { charset: "utf-8" },
      { name: "theme-color", content: "#000000" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  telemetry: false,
  loading: false,
  loadingIndicator: false,

  css: ["@/assets/style.scss"],

  plugins: ["~plugins/vee-validate"],

  buildModules: ["@nuxtjs/date-fns"],

  dateFns: { defaultLocale: "ru" },

  modules: ["@nuxtjs/axios", "@nuxtjs/auth", "@nuxtjs/toast"],

  axios: { proxy: true },

  proxy: {
    "/api/": process.env.BASE_URL
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/auth/login",
            method: "post",
            propertyName: "token"
          },
          logout: { url: "/api/auth/logout", method: "post" },
          user: { url: "/api/auth/user", method: "get", propertyName: "user" }
        }
      }
    }
  },

  build: {
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {}
  }
};
