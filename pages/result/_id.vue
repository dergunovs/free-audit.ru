<template>
  <div>
    <h1>{{ result.audit._id.name }} сайта {{ result.url }}</h1>
    <div class="text-center">
      Дата создания {{ $dateFns.format(new Date(result.date_created), "HH:mm dd.MM.yyyy г.") }}
    </div>

    <ValidationObserver
      v-if="!result.passwordCreated"
      class="form form-result-password-save form-center"
      v-slot="{ invalid }"
      tag="div"
    >
      <div class="group w100 text-center">
        Создайте доступ для редактирования результатов аудита. Ссылка на данный аудит и пароль будут высланы на
        указанную электронную почту.
      </div>
      <ValidationProvider rules="required|email" v-slot="{ errors }" class="group w25" tag="div">
        <label for="email">
          Электронная почта
        </label>
        <input v-model="email" type="text" id="email" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <ValidationProvider rules="required|min:3" v-slot="{ errors }" class="group w25" tag="div">
        <label for="password">
          Пароль
        </label>
        <input v-model="password" type="password" id="password" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="group w12 button-bottom">
        <button v-on:click="resultPasswordCreate" :disabled="invalid" class="input button">
          Сохранить
        </button>
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
        <component :is="question.feature" :siteUrl="result.url" />
      </div>

      <div v-for="(answer, index) in question.answers" :key="answer.index" class="group w25">
        <input v-model="question.answer_picked" type="radio" :id="answer._id" :value="answer._id" />
        <label :for="answer._id">{{ answer.name }}</label>
        <div v-html="answer.recomendation" :class="`answer-text answer${index}`"></div>
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

    <div v-if="$nuxt.$auth.user" class="form">
      <div class="group w12 button-bottom">
        <button class="input button delete" v-on:click="resultDelete">
          Удалить
        </button>
      </div>
    </div>

    <div v-html="result.audit._id.conclusion" class="result-introtext-conclusion result-margin-bottom"></div>

    <div v-if="result.passwordCreated" class="form form-result-update">
      <div v-if="!this.$store.state.resultPassword" class="group w12">
        <input v-model="resultCheck" type="password" class="input" placeholder="Введите пароль" />
      </div>
      <div class="group w12 button-bottom">
        <button class="input button" v-on:click="resultUpdate">
          Обновить
        </button>
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
    tinyKey: process.env.tinyKey,
    email: "",
    password: "",
    resultCheck: ""
  }),
  async asyncData({ params }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/result/${params.id}`);
      return { result: data.data };
    } catch (err) {
      console.log(err);
    }
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver,
    serverResponse: () => import("~/components/question/serverResponse.vue")
  },
  methods: {
    resultUpdate() {
      let passwordFiltered = this.$store.state.resultPassword ? this.$store.state.resultPassword : this.resultCheck;
      let formData = {
        questions: this.result.audit._id.questions,
        passwordCheck: passwordFiltered
      };
      axios
        .patch(`${process.env.baseUrl}/api/result/${this.result._id}`, formData)
        .then(response => {
          if (!this.$store.state.resultPassword) {
            this.$store.commit("toggleAdminMenu", this.resultCheck);
          }
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
    },
    resultPasswordCreate() {
      let formData = {
        email: this.email,
        password: this.password,
        passwordCreated: true
      };
      axios
        .patch(`${process.env.baseUrl}/api/result/${this.result._id}/password`, formData)
        .then(response => {
          this.result.passwordCreated = response.data.passwordCreated;
          this.$store.commit("toggleAdminMenu", this.password);
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
      let formDataEmail = {
        email: this.email,
        password: this.password
      };
      axios.post(`${process.env.baseUrl}/api/email`, formDataEmail);
    }
  }
};
</script>
