module.exports = {
  mode: "universal",

  server: {
    port: 3000,
    host: "localhost"
  },

  env: {
    baseUrl: "http://localhost:3000"
  },

  head: {
    htmlAttrs: { lang: "ru" },
    meta: [
      { charset: "utf-8" },
      { name: "theme-color", content: "#000000" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  telemetry: false,
  loading: false,
  loadingIndicator: false,

  css: ["@/assets/style.scss"],

  plugins: ["~plugins/vee-validate"],

  serverMiddleware: [],

  buildModules: ["@nuxtjs/date-fns"],

  dateFns: { defaultLocale: "ru" },

  modules: ["@nuxtjs/axios", "@nuxt/http", "@nuxtjs/auth", "@nuxtjs/toast"],

  axios: { proxy: true },

  proxy: {
    "/api/": "http://free-audit.ru"
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "api/auth/login",
            method: "post",
            propertyName: "token.accessToken"
          },
          user: { propertyName: false }
        }
      }
    },
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/"
    }
  },

  build: {
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {
    }
  }
};
