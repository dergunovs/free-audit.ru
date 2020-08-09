<template>
  <div>
    <h1>Создать вопрос</h1>
    <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required" v-slot="{ errors }" class="group w50" tag="div">
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
        <button class="input button" :disabled="invalid" v-on:click="questionCreate">
          Опубликовать
        </button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    name: "",
    introtext: "",
    level: "",
    feature: "",
    componentsList: [],
    tinyKey: process.env.tinyKey
  }),
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    questionCreate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        level: this.level,
        feature: this.feature
      };
      axios
        .post(`${process.env.baseUrl}/api/question`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          setTimeout(() => {
            this.$router.push(`/question`);
          }, 500),
            this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
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
    const getComponents = require.context("~/components/question", false, /\.vue$/);
    this.componentsList = getComponents
      .keys()
      .map(file => [file.replace(/(^.\/)|(\.vue$)/g, ""), getComponents(file)][0]);
  }
};
</script>
