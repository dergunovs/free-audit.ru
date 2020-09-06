<template>
  <div>
    <h1>Список аудитов</h1>
    <div class="form">
      <div class="group w12 button-bottom">
        <nuxt-link to="/audit/create" class="input button">Создать</nuxt-link>
      </div>
    </div>
    <div class="list-block" v-if="audits">
      <div v-for="audit in audits" :key="audit.index" class="list-item">
        <nuxt-link :to="`/audit/${audit._id}`" class="list-item-link">
          {{ audit.name }}
        </nuxt-link>
        <div class="list-item-text" v-html="audit.introtext"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  layout: "admin",
  async asyncData() {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/audit/`);
      return { audits: data.data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  head: {
    title: "Список аудитов"
  }
};
</script>
