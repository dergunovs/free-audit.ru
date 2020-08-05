<template>
  <div>
    <h1>Создать аудит</h1>
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
            images_upload_handler: function(blobInfo, success) {
              tinyAddFile(blobInfo, success);
            }
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
            images_upload_handler: function(blobInfo, success) {
              tinyAddFile(blobInfo, success);
            }
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="group w12 button-bottom">
        <button class="input button" :disabled="invalid" v-on:click="auditCreate">
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
    conclusion: "",
    tinyKey: process.env.tinyKey
  }),
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    auditCreate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        conclusion: this.conclusion
      };
      axios
        .post(`${process.env.baseUrl}/api/audit`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          setTimeout(() => {
            this.$router.push(`/audit`);
          }, 500),
            this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    tinyAddFile(blobInfo, success) {
      let formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      axios
        .post(`${process.env.baseUrl}/api/audit/addFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => success(`/uploads/audit/${response.data.filename}`));
    }
  }
};
</script>
