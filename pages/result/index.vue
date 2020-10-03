<template>
  <div>
    <h1>Результаты аудитов</h1>
    <div class="list-block">
      <div v-for="result in results" :key="result.index" class="list-item">
        <nuxt-link :to="`/result/${result._id}`" class="list-item-link">{{ result.url }}</nuxt-link>
        <span v-on:click="resultDelete(result._id)" class="list-item-delete">X</span>
        <div>
          {{ result.audit._id.name }}, {{ $dateFns.format(new Date(result.date_created), "dd.MM.yyyy г. HH:mm") }}
          <span v-if="result.passwordCreated">
            <a :href="`mailto:${result.email}`">{{ result.email }}</a>
          </span>
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
  },
  methods: {
    resultDelete(resutlId) {
      axios
        .delete(`${process.env.baseUrl}/api/result/${resutlId}`, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          axios
            .get(`${process.env.baseUrl}/api/result/`, {
              headers: {
                Authorization: this.$auth.$storage._state["_token.local"]
              }
            })
            .then(response => {
              this.results = response.data;
            });
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  }
};
</script>
