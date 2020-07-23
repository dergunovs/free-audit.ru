<template>
  <div>
    <h1>Список аудитов</h1>
    <div class="form">
      <div class="group w12 button-bottom">
        <nuxt-link to="/audit/create" class="input">Создать</nuxt-link>
      </div>
      <div class="audits-block" v-if="audits">
        <div v-for="audit in audits" :key="audit.index" class="audit">
          <nuxt-link :to="`/audit/${audit._id}`">
            {{ audit.name }}
          </nuxt-link>
          <div v-html="audit.introtext"></div>
        </div>
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
      const { data } = await axios.get(`${process.env.baseUrl}/api/audit/`, {
        headers: {
          Authorization: app.$auth.$storage._state["_token.local"]
        }
      });
      return { audits: data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  }
};
</script>
