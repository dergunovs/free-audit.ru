<template>
  <div>
    <h1>{{ result.audit._id.name }} сайта {{ result.url }}</h1>
    <div class="text-center">
      Дата создания {{ $dateFns.format(new Date(result.date_created), "HH:mm dd.MM.yyyy г.") }}
    </div>

    <ValidationObserver class="form form-result-password-save form-center" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required|email" v-slot="{ errors }" class="group w25" tag="div">
        <label for="email"> Выслать ссылку на аудит</label>
        <input v-model="email" type="text" id="email" class="input" placeholder="Электронная почта" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="group w12 button-bottom">
        <button v-on:click="resultSend" :disabled="invalid" class="input button">Отправить</button>
      </div>
    </ValidationObserver>

    <div v-html="result.audit._id.introtext" class="result-introtext-conclusion"></div>

    <div v-for="question in result.audit._id.questions" :key="question.index" class="form form-result">
      <div class="group w100">
        <h2>{{ question.name }}</h2>
        <div class="question-level">{{ question.level }}</div>
        <div v-html="question.introtext"></div>
      </div>

      <div class="group w100">
        <component
          :is="question.feature"
          :url="result.url"
          :answers="question.answers"
          :answerPicked="question.answer_picked"
        ></component>
      </div>

      <div v-for="(answer, index) in question.answers" :key="answer.index" class="group w25">
        <input
          v-model="question.answer_picked"
          type="radio"
          :id="answer._id"
          :value="answer._id"
          v-on:change="resultUpdate"
        />
        <label :for="answer._id">{{ answer.name }}</label>
        <div v-html="answer.recomendation" :class="`answer-text answer${index}`"></div>
      </div>

      <div class="group w100">
        <label :for="`comment${question._id}`">Комментарий</label>
        <Editor
          v-model="question.comment"
          v-on:onBlur="resultUpdate"
          :id="`comment${question._id}`"
          :api-key="tinyKey"
          :init="{
            height: 160,
            menubar: false,
            language: 'ru',
            plugins: ['autolink lists link table'],
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link',
          }"
        />
      </div>
    </div>

    <div v-if="$nuxt.$auth.user" class="form">
      <div class="group w12 button-bottom">
        <button class="input button delete" v-on:click="resultDelete">Удалить</button>
      </div>
    </div>

    <div v-html="result.audit._id.conclusion" class="result-introtext-conclusion result-margin-bottom"></div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    result: { audit: { questions: [{ _id: "", answer_picked: "", comment: "" }] } },
    tinyKey: process.env.tinyKey,
    email: "",
    resultCheck: "",
  }),
  async asyncData({ $axios, params }) {
    try {
      const data = await $axios.get(`/api/result/${params.id}`);
      return { result: data.data };
    } catch (err) {
      console.log(err);
    }
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    };
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver,
  },
  head() {
    return {
      title: this.result.audit._id.name + " сайта " + this.result.url,
    };
  },
  methods: {
    resultUpdate() {
      let formData = {
        questions: this.result.audit._id.questions,
      };
      this.$axios
        .patch(`/api/result/${this.result._id}`, formData)
        .then((response) => {
          this.result.audit.questions = response.data.questions;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    resultDelete() {
      this.$axios
        .delete(`/api/result/${this.result._id}`, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"],
          },
        })
        .then((response) => {
          setTimeout(() => {
            this.$router.push(`/result/`);
          }, 500),
            this.$toast.success("Готово", { duration: 1000 });
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    resultSend() {
      let formData = {
        email: this.email,
      };
      this.$axios.post(`/api/email`, formData);
    },
  },
};
</script>
