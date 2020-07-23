<template>
  <div>
    <h1>Список вопросов</h1>
    <div class="form">
      <div class="group w12 button-bottom">
        <nuxt-link to="/question/create" class="input">Создать</nuxt-link>
      </div>
      <div class="questions-block" v-if="questions">
        <div v-for="question in questions" :key="question.index" class="question">
          <nuxt-link :to="`/question/${question._id}`">
            {{ question.name }}
          </nuxt-link>
          {{ question.level }}
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
      const { data } = await axios.get(`${process.env.baseUrl}/api/question/`, {
        headers: {
          Authorization: app.$auth.$storage._state["_token.local"]
        }
      });
      return { questions: data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  }
};
</script>
