<template>
  <div>
    <h1>Список вопросов</h1>
    <div class="form">
      <div class="group w12 button-bottom">
        <nuxt-link to="/question/create" class="input button">Создать</nuxt-link>
      </div>
    </div>
    <div class="list-block" v-if="questions">
      <div v-for="question in questions" :key="question.index" class="list-item">
        <nuxt-link :to="`/question/${question._id}`" class="list-item-link">
          {{ question.name }}
        </nuxt-link>
        <div>
          <b>{{ question.level }}</b>
        </div>
        <div class="list-item-text" v-html="question.introtext"></div>
        <div>
          <b>Создан: {{ $dateFns.format(new Date(question.date_created), "dd.MM.yyyy г. HH:mm") }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  async asyncData({ $axios }) {
    try {
      const data = await $axios.get(`/api/question/`);
      return { questions: data.data };
    } catch (err) {
      if (err.response?.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  head: {
    title: "Список вопросов",
  },
};
</script>
