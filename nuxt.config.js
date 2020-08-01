module.exports = {
  mode: "universal",

  server: {
    port: 3000,
    host: "localhost"
  },

  env: {
    baseUrl: "http://localhost:3000",
    tinyKey: "px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
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
    "/api/": "http://localhost:3000"
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
