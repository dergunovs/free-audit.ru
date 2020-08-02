<template>
  <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
    <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
      <label for="answer-name-new">Текст ответа</label>
      <input id="answer-name-new" type="text" v-model="answer.name" class="input" />
      <span class="error-message">{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
      <label for="answer-recomendation-new">Рекомендация</label>
      <Editor
        v-model="answer.recomendation"
        id="answer-recomendation-new"
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
      <span class="error-message">{{ errors[0] }}</span>
    </ValidationProvider>

    <div class="group w12 button-bottom">
      <button class="input button" :disabled="invalid" v-on:click="answerCreate">
        Добавить ответ
      </button>
    </div>
  </ValidationObserver>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    answer: { name: "", recomendation: "" }
  }),
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  props: ["questionId"],
  methods: {
    answerCreate() {
      let formData = {
        name: this.answer.name,
        recomendation: this.answer.recomendation
      };
      axios
        .post(`${process.env.baseUrl}/api/question/${this.questionId}/answer`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          let answersUpdated = response.data.answers;
          this.$emit("answerCreate", answersUpdated);
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  }
};
</script>
