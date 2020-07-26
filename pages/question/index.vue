<template>
  <div>
    <h1>Список вопросов</h1>
    <div class="form">
      <div class="group w12 button-bottom">
        <nuxt-link to="/question/create" class="input">Создать</nuxt-link>
      </div>
    </div>
    <div class="list-block" v-if="questions">
      <div v-for="question in questions" :key="question.index" class="list-item">
        <nuxt-link :to="`/question/${question._id}`" class="list-item-link">
          {{ question.name }}
        </nuxt-link>
        <div class="list-item-text" v-html="question.introtext"></div>
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
      const data = await axios.get(`${process.env.baseUrl}/api/question/`);
      return { questions: data.data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  }
};
</script>
