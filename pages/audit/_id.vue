<template>
  <div>
    <h1>{{ audit.name }}</h1>
    <div class="text-center">Дата создания {{ date_formatted }}</div>
    <ValidationObserver class="form" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required|min:3|max:20" v-slot="{ errors }" class="group w100" tag="div">
        <label for="name">Название аудита</label>
        <input name="name" id="name" type="text" v-model="name" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="introtext">Вступление</label>
        <Editor
          api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
          v-model="introtext"
          :init="{
            height: 300,
            menubar: true,
            language: 'ru',
            plugins: ['autolink lists link image visualblocks code table paste'],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist'
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors }" class="group w100" tag="div">
        <label for="conclusion">Вывод</label>
        <Editor
          api-key="px4oj8yav594v5i49di48fr54hs0tw06l30diztm3hhy3i3z"
          v-model="conclusion"
          :init="{
            height: 300,
            menubar: true,
            language: 'ru',
            plugins: ['autolink lists link image visualblocks code table paste'],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist'
          }"
        />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="group w100">
        <div class="buttons-block">
          <button class="input button" :disabled="invalid" v-on:click="auditUpdate">
            Обновить
          </button>
          <button class="input button delete" v-on:click="auditDelete">
            Удалить
          </button>
        </div>
      </div>
    </ValidationObserver>
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
    conclusion: "",
    date_created: "",
    date_formatted: ""
  }),
  async asyncData({ params, app }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/audit/${params.id}`, {
        headers: {
          Authorization: app.$auth.$storage._state["_token.local"]
        }
      });
      return { audit: data.data };
    } catch (err) {
      if (err.response.status === 403) {
        $nuxt.$auth.logout();
      }
    }
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    auditUpdate() {
      let formData = {
        name: this.name,
        introtext: this.introtext,
        conclusion: this.conclusion
      };
      axios
        .patch(`${process.env.baseUrl}/api/audit/${this.audit._id}`, formData, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(response => {
          this.audit.name = response.data.name;
          this.audit.introtext = response.data.introtext;
          this.audit.conclusion = response.data.conclusion;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    auditDelete() {
      axios
        .delete(`${process.env.baseUrl}/api/audit/${this.audit._id}`, {
          headers: {
            Authorization: this.$auth.$storage._state["_token.local"]
          }
        })
        .then(
          setTimeout(() => {
            this.$router.push(`/audit/`);
          }, 500),
          this.$toast.success("Готово", { duration: 1000 })
        )
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  },
  mounted() {
    this.name = this.audit.name;
    this.introtext = this.audit.introtext;
    this.conclusion = this.audit.conclusion;
    let createdDate = new Date(this.audit.date_created);
    this.date_formatted =
      createdDate.getDate() + "." + (createdDate.getMonth() + 1) + "." + createdDate.getFullYear() + " г.";
  }
};
</script>