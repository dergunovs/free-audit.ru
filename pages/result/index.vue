<template>
  <div>
    <h1>Результаты аудитов</h1>
    <div class="list-block">
      <div v-for="result in results" :key="result.index" class="list-item">
        <nuxt-link :to="`/result/${result._id}`" class="list-item-link">
          {{ result.url }}
        </nuxt-link>
        <br />
        {{ result.audit.name }}, {{ $dateFns.format(new Date(result.date_created), "HH:mm dd.MM.yyyy г.") }}
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
  }
};
</script>
