<template>
  <div>
    <h1>{{ result.audit._id.name }} сайта {{ result.url }}</h1>
    <div class="text-center">
      Дата создания {{ $dateFns.format(new Date(result.date_created), "HH:mm dd.MM.yyyy г.") }}
    </div>

    <div v-html="result.audit._id.introtext" class="introtext-conclusion"></div>

    <div v-for="question in result.audit._id.questions" :key="question.index" class="form form-result">
      <div class="group w100">
        <h2>{{ question.name }}</h2>
        <div class="question-level">{{ question.level }}</div>
        <div v-html="question.introtext"></div>
      </div>

      <div v-for="(answer, index) in question.answers" :key="answer.index" class="group w25">
        <input v-model="question.answer_picked" type="radio" :id="answer._id" :value="answer._id" />
        <label :for="answer._id">{{ answer.name }}</label>
        <div v-html="answer.recomendation" :id="answer._id" :class="`answer-text answer${index}`"></div>
      </div>

      <div class="group w100">
        <label :for="`comment${question._id}`">Комментарий</label>
        <Editor
          v-model="question.comment"
          :id="`comment${question._id}`"
          :api-key="tinyKey"
          :init="{
            height: 270,
            menubar: false,
            language: 'ru',
            plugins: ['autolink lists link table'],
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link'
          }"
        />
      </div>
    </div>

    <div v-html="result.audit._id.conclusion" class="introtext-conclusion"></div>

    <div class="form">
      <div class="group w100">
        <div class="buttons-block">
          <button class="input button" v-on:click="resultUpdate">
            Обновить
          </button>
          <button class="input button delete" v-on:click="resultDelete">
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    result: { audit: { questions: [{ _id: "", answer_picked: "", comment: "" }] } },
    tinyKey: process.env.tinyKey
  }),
  async asyncData({ params }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/result/${params.id}`);
      return { result: data.data };
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    resultUpdate() {
      let formData = {
        questions: this.result.audit._id.questions
      };
      axios
        .patch(`${process.env.baseUrl}/api/result/${this.result._id}`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          this.result.audit.questions = response.data.questions;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    resultDelete() {
      axios
        .delete(`${process.env.baseUrl}/api/result/${this.result._id}`, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          setTimeout(() => {
            this.$router.push(`/result/`);
          }, 500),
            this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  }
};
</script>
