<template>
  <header>
    <div class="center">
      <nav :class="{ navShow: navToggle }" v-on:click="navToggle = !navToggle">
        <nuxt-link to="/">Главная</nuxt-link>
        <nuxt-link to="/about">О проекте</nuxt-link>
        <nuxt-link to="/login" v-if="!$nuxt.$auth.user">Войти</nuxt-link>
        <nuxt-link v-if="$nuxt.$auth.user" to="/audit">Аудиты</nuxt-link>
        <nuxt-link v-if="$nuxt.$auth.user" to="/question">Вопросы</nuxt-link>
        <nuxt-link v-if="$nuxt.$auth.user" to="/result">Результаты</nuxt-link>
        <a v-if="$nuxt.$auth.user" v-on:click="logout">Выйти</a>
      </nav>

      <div class="toggle-nav" v-on:click="navToggle = !navToggle">☰</div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      navToggle: false
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
    }
  }
};
</script>
