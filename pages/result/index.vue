<template>
  <div>
    <h1>Результаты аудитов</h1>
    <div class="list-block">
      <div v-for="result in results" :key="result.index" class="list-item">
        <nuxt-link :to="`/result/${result._id}`" class="list-item-link">{{ result.url }}</nuxt-link>
        {{ result.audit._id.name }}, {{ $dateFns.format(new Date(result.date_created), "dd.MM.yyyy г. HH:mm") }}
        <span v-if="result.passwordCreated">
          - <b>Доступ создан</b>, <a :href="`mailto:${result.email}`">{{ result.email }}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  layout: "admin",
  async asyncData(app) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/result/`, {
        headers: {
          Authorization: app.$auth.$storage._state["_token.local"]
        }
      });
      return { results: data.data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  head: {
    title: "Список результатов аудитов"
  }
};
</script>
