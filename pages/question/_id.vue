<template>
  <div>
    <h1>{{ question.name }}</h1>
    <div class="text-center">Дата создания {{ date_formatted }}</div>
    <div class="tag-list" v-if="audits.length">
      Используется в аудитах:
      <span v-for="audit in audits" :key="audit.index" class="tag">
        <nuxt-link :to="`/audit/${audit._id}`">{{ audit.name }}</nuxt-link>
      </span>
    </div>
    <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required|min:3|max:20" v-slot="{ errors }" class="group w50" tag="div">
        <label for="name">Название вопроса</label>
        <input id="name" type="text" v-model="name" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w50" tag="div">
        <label for="level">Уровень сложности</label>
        <select class="input" v-model="level">
          <option value="Лёгкий">Лёгкий</option>
          <option value="Средний">Средний</option>
          <option value="Сложный">Сложный</option>
        </select>
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="introtext">Вступление</label>
        <Editor
          api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
          v-model="introtext"
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
          <button class="input button" :disabled="invalid" v-on:click="questionUpdate">
            Обновить
          </button>
          <button class="input button delete" v-on:click="questionDelete">
            Удалить
          </button>
        </div>
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
          <label :for="`introtext${answer._id}`">Текст ответа</label>
          <input
            type="text"
            v-model="answer.introtext"
            class="input"
            :ref="`introtext${answer._id}`"
            :id="`introtext${answer._id}`"
          />
          <span class="error-message">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
          <label :for="`recomendation${answer._id}`">Рекомендация</label>
          <Editor
            api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
            v-model="answer.recomendation"
            :ref="`recomendation${answer._id}`"
            :id="`recomendation${answer._id}`"
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
            <button
              class="input button"
              :disabled="invalid"
              v-on:click="answerUpdate(answer)"
              :ref="`update${answer._id}`"
            >
              Обновить
            </button>
            <button class="input button delete" v-on:click="answerDelete(answer)">
              Удалить
            </button>
          </div>
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
    date_formatted: "",
    showAnswerAdd: false,
    answers: [{ introtext: "", recomendation: "" }]
  }),
  async asyncData({ params }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/question/${params.id}`);
      const audits = await axios.get(`${process.env.baseUrl}/api/audit/question/${params.id}`);
      return { question: data.data, audits: audits.data };
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
    answerAdd: () => import("~/components/answerAdd.vue")
  },
  methods: {
    questionUpdate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        level: this.level
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
        answerIntrotext: this.$refs["introtext" + answer._id][0].value,
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
    }
  },
  mounted() {
    this.name = this.question.name;
    this.introtext = this.question.introtext;
    this.level = this.question.level;
    let createdDate = new Date(this.question.date_created);
    this.date_formatted =
      createdDate.getDate() + "." + (createdDate.getMonth() + 1) + "." + createdDate.getFullYear() + " г.";
  }
};
</script>
