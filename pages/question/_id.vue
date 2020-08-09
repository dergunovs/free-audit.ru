<template>
  <div>
    <h1>{{ question.name }}</h1>
    <div class="text-center">Дата создания {{ $dateFns.format(new Date(question.date_created), "dd.MM.yyyy г.") }}</div>
    <div class="tag-list" v-if="audits.length">
      Используется в аудитах:
      <span v-for="audit in audits" :key="audit.index" class="tag">
        <nuxt-link :to="`/audit/${audit._id}`">{{ audit.name }}</nuxt-link>
      </span>
    </div>
    <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required|min:3|max:20" v-slot="{ errors }" class="group w50" tag="div">
        <label for="name">Название вопроса</label>
        <input v-model="name" type="text" id="name" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w25" tag="div">
        <label for="level">Уровень сложности</label>
        <select v-model="level" id="level" class="input">
          <option value="Лёгкий">Лёгкий</option>
          <option value="Средний">Средний</option>
          <option value="Сложный">Сложный</option>
        </select>
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="" v-slot="{ errors }" class="group w25" tag="div">
        <label for="features">Функциональность</label>
        <select v-model="feature" id="feature" class="input">
          <option value="">Нет</option>
          <option v-for="component in componentsList" :key="component.index" :value="component">{{ component }}</option>
        </select>
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="introtext">Вступление</label>
        <Editor
          v-model="introtext"
          id="introtext"
          :api-key="tinyKey"
          :init="{
            height: 270,
            menubar: false,
            language: 'ru',
            plugins: ['autolink lists link table image'],
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link image',
            images_upload_handler: function(blobInfo, success) {
              tinyAddFile(blobInfo, success);
            }
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="group w12 button-bottom">
        <button class="input button" :disabled="invalid" v-on:click="questionUpdate">
          Обновить
        </button>
      </div>
      <div class="group w12 button-bottom">
        <button class="input button delete" v-on:click="questionDelete">
          Удалить
        </button>
      </div>
    </ValidationObserver>

    <h2>Ответы <span v-on:click="showAnswerAdd = true">+</span></h2>

    <answerAdd v-if="showAnswerAdd" :questionId="question._id" @answerCreate="updateAnswers" />

    <div class="answers-block">
      <ValidationObserver
        v-for="answer in question.answers"
        :key="answer.index"
        class="form form-half-width"
        v-slot="{ invalid }"
        tag="div"
      >
        <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
          <label :for="`name${answer._id}`">Текст ответа</label>
          <input type="text" v-model="answer.name" class="input" :ref="`name${answer._id}`" :id="`name${answer._id}`" />
          <span class="error-message">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
          <label :for="`recomendation${answer._id}`">Рекомендация</label>
          <Editor
            v-model="answer.recomendation"
            :ref="`recomendation${answer._id}`"
            :id="`recomendation${answer._id}`"
            :api-key="tinyKey"
            :init="{
              height: 270,
              menubar: false,
              language: 'ru',
              plugins: ['autolink lists link table image'],
              toolbar:
                'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link image',
              images_upload_handler: function(blobInfo, success) {
                tinyAddFile(blobInfo, success);
              }
            }"
          />
          <span class="error-message">{{ errors[0] }}</span>
        </ValidationProvider>

        <div class="group w25 button-bottom">
          <button
            class="input button"
            :disabled="invalid"
            v-on:click="answerUpdate(answer)"
            :ref="`update${answer._id}`"
          >
            Обновить
          </button>
        </div>
        <div class="group w25 button-bottom">
          <button class="input button delete" v-on:click="answerDelete(answer)">
            Удалить
          </button>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  layout: "admin",
  data: () => ({
    name: "",
    introtext: "",
    level: "",
    date_created: "",
    feature: "",
    componentsList: [],
    showAnswerAdd: false,
    answers: [{ name: "", recomendation: "" }],
    tinyKey: process.env.tinyKey
  }),
  async asyncData({ app, params }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/question/${params.id}`);
      const audits = await axios.get(`${process.env.baseUrl}/api/audit/question/${params.id}`);
      return {
        question: data.data,
        audits: audits.data
      };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver,
    answerAdd: () => import("~/components/answerAdd.vue"),
    serverResponse: () => import("~/components/question/serverResponse.vue")
  },
  methods: {
    questionUpdate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        level: this.level,
        feature: this.feature
      };
      axios
        .patch(`${process.env.baseUrl}/api/question/${this.question._id}`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          this.question.name = response.data.name;
          this.question.introtext = response.data.introtext;
          this.question.level = response.data.level;
          this.question.feature = response.data.feature;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    questionDelete() {
      axios
        .delete(`${process.env.baseUrl}/api/question/${this.question._id}`, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(
          setTimeout(() => {
            this.$router.push(`/question/`);
          }, 500),
          this.$toast.success("Готово", { duration: 1000 })
        )
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    answerUpdate(answer) {
      let formData = {
        answerId: answer._id,
        answerName: this.$refs["name" + answer._id][0].value,
        answerRecomendation: this.$refs["recomendation" + answer._id][0].value
      };
      axios
        .patch(`${process.env.baseUrl}/api/question/${this.question._id}/answer`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          this.question.answers = response.data.answers;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    answerDelete(answer) {
      axios
        .delete(`${process.env.baseUrl}/api/question/${this.question._id}/answer`, {
          data: { answerId: answer._id },
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          this.question.answers = response.data.answers;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    updateAnswers(answersUpdated) {
      setTimeout(() => {
        this.question.answers = answersUpdated;
      }, 500),
        (this.showAnswerAdd = false);
    },
    tinyAddFile(blobInfo, success) {
      let formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      axios
        .post(`${process.env.baseUrl}/api/question/addFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => success(`/uploads/question/${response.data.filename}`));
    }
  },
  mounted() {
    this.name = this.question.name;
    this.introtext = this.question.introtext;
    this.level = this.question.level;
    this.feature = this.question.feature;
    const getComponents = require.context("~/components/question", false, /\.vue$/);
    this.componentsList = getComponents
      .keys()
      .map(file => [file.replace(/(^.\/)|(\.vue$)/g, ""), getComponents(file)][0]);
  }
};
</script>
