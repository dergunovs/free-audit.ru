<template>
  <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
    <ValidationProvider rules="required|min:5" v-slot="{ errors }" class="group w100" tag="div">
      <label for="answer-introtext-new">Текст ответа</label>
      <input id="answer-introtext-new" type="text" v-model="answer.introtext" class="input" />
      <span class="error-message">{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
      <label for="answer-recomendation-new">Рекомендация</label>
      <Editor
        api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
        v-model="answer.recomendation"
        id="answer-recomendation-new"
        :init="{
          height: 270,
          menubar: true,
          language: 'ru',
          plugins: ['autolink lists link visualblocks code table paste'],
          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist'
        }"
      />
      <span class="error-message">{{ errors[0] }}</span>
    </ValidationProvider>

    <div class="group w100">
      <div class="buttons-block">
        <button class="input button" :disabled="invalid" v-on:click="answerCreate">
          Добавить ответ
        </button>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    answer: { introtext: "", recomendation: "" }
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
        introtext: this.answer.introtext,
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
