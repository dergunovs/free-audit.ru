<template>
  <div>
    <h1>{{ audit.name }}</h1>
    <div class="text-center">Дата создания {{ $dateFns.format(new Date(audit.date_created), "dd.MM.yyyy г.") }}</div>
    <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="name">Название аудита</label>
        <input v-model="name" type="text" id="name" class="input" />
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
            images_upload_handler: function (blobInfo, success) {
              tinyAddFile(blobInfo, success);
            },
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="conclusion">Вывод</label>
        <Editor
          v-model="conclusion"
          id="conclusion"
          :api-key="tinyKey"
          :init="{
            height: 270,
            menubar: false,
            language: 'ru',
            plugins: ['autolink lists link table image'],
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link image',
            images_upload_handler: function (blobInfo, success) {
              tinyAddFile(blobInfo, success);
            },
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="group w50">
        <h2>Текущие вопросы</h2>
        <draggable
          v-model="questions"
          group="questions"
          @start="drag = true"
          @end="drag = false"
          class="question-draggable-list"
        >
          <div v-for="question in questions" :key="question.index" class="question-draggable">
            <div class="question-name">{{ question.name }}</div>
            <nuxt-link :to="`/question/${question._id}`">Редактировать</nuxt-link>
          </div>
        </draggable>
      </div>
      <div class="group w50">
        <h2>Общий список вопросов</h2>
        <draggable
          v-model="questionsList"
          group="questions"
          @start="drag = true"
          @end="drag = false"
          class="question-draggable-list"
        >
          <div v-for="question in questionsList" :key="question.index" class="question-draggable">
            <div class="question-name">{{ question.name }}</div>
            <nuxt-link :to="`/question/${question._id}`">Редактировать</nuxt-link>
          </div>
        </draggable>
      </div>

      <div class="group w12 button-bottom">
        <button class="input button" :disabled="invalid" v-on:click="auditUpdate">Обновить</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import draggable from "vuedraggable";

export default {
  async asyncData({ $axios, params }) {
    try {
      const data = await $axios.get(`/api/audit/${params.id}`);
      const questionsList = await $axios.get(`/api/question/`);
      return { audit: data.data, questionsList: questionsList.data };
    } catch (err) {
      if (err.response?.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  data: () => ({
    name: "",
    introtext: "",
    conclusion: "",
    date_created: "",
    date_formatted: "",
    questions: [],
    questionsList: [],
    tinyKey: process.env.tinyKey,
  }),
  layout: "admin",
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver,
    draggable,
  },
  head() {
    return {
      title: this.audit.name + " - редактировать",
    };
  },
  methods: {
    auditUpdate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        conclusion: this.conclusion,
        questions: this.questions,
      };
      this.$axios
        .patch(`/api/audit/${this.audit._id}`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"],
          },
        })
        .then((response) => {
          this.audit.name = response.data.name;
          this.audit.introtext = response.data.introtext;
          this.audit.conclusion = response.data.conclusion;
          this.audit.questions = response.data.questions;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    tinyAddFile(blobInfo, success) {
      let formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      this.$axios
        .post(`/api/audit/addFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$auth.$storage._state["_token.local"],
          },
        })
        .then((response) => success(`/uploads/audit/${response.data.filename}`));
    },
  },
  mounted() {
    this.name = this.audit.name;
    this.introtext = this.audit.introtext;
    this.conclusion = this.audit.conclusion;
    this.questions = this.audit.questions;
    let questionsIds = this.questions.map((item) => {
      return item._id;
    });
    this.questionsList = this.questionsList.filter((item) => !questionsIds.includes(item._id));
  },
};
</script>
