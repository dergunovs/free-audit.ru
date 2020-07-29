<template>
  <div>
    <h1>{{ result.audit._id.name }} сайта {{ result.url }}</h1>
    <div class="text-center">
      Дата создания {{ $dateFns.format(new Date(result.date_created), "HH:mm dd.MM.yyyy г.") }}
    </div>
    <div class="form">
      <div class="group w100">
        <div v-html="result.audit._id.introtext"></div>
      </div>

      <div class="group w100">
        <div v-for="question in result.audit._id.questions" :key="question.index">
          <h2>{{ question.name }}</h2>
          <div class="question-level">{{ question.level }}</div>
          <div v-html="question.introtext"></div>

          <div class="form">
            <div v-for="answer in question.answers" :key="answer.index" class="group w25">
              <input type="radio" :id="answer._id" :value="answer._id" v-model="question.answer_picked" />
              <label :for="answer._id">{{ answer.name }}</label>
              <div class="answer-text" v-html="answer.recomendation"></div>
            </div>
          </div>

          <label :for="`comment${question._id}`">Комментарий</label>
          <Editor
            api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
            v-model="question.comment"
            :id="`comment${question._id}`"
            :init="{
              height: 270,
              menubar: true,
              language: 'ru',
              plugins: ['autolink lists link visualblocks code table paste'],
              toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist'
            }"
          />
        </div>
      </div>

      <div class="group w100">
        <div v-html="result.audit._id.conclusion"></div>
      </div>

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
    url: "",
    audit: { questions: [{ _id: "", answer_picked: "", comment: "" }] },
    date_created: ""
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
          this.audit.questions = response.data.questions;
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
