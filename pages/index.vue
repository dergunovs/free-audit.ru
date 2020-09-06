<template>
  <div>
    <h1>Бесплатный онлайн аудит сайта</h1>
    <ValidationObserver class="form form-center form-main" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required" v-slot="{ errors }" class="group w25" tag="div">
        <select v-model="audit" class="input">
          <option value="">Выберите аудит</option>
          <option v-for="audit in audits" :key="audit.index" :value="audit._id">{{ audit.name }}</option>
        </select>
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <ValidationProvider
        :rules="{
          required: true,
          regex: /^([\w\.а-яёА-ЯЁ-]+)\.([a-zA-Zа-яёА-ЯЁ-]{2,6}\.?)(\/[\w\.]*)*\/?$/
        }"
        v-slot="{ errors }"
        class="group w50"
        tag="div"
      >
        <input type="text" v-model="url" placeholder="Введите адрес сайта без www, http или https" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="group w25 button-bottom">
        <button v-on:click="resultCreate" :disabled="invalid" class="input button">Начать аудит</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import axios from "axios";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    audit: "",
    url: ""
  }),
  async asyncData() {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/audit/`);
      return { audits: data.data };
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  head: {
    title: "Бесплатный онлайн аудит сайта free-audit.ru",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "Бесплатный онлайн аудит сайта free-audit.ru - технический, юзабилити, seo аудит."
      }
    ]
  },
  methods: {
    resultCreate() {
      let formData = {
        audit: { _id: this.audit },
        url: this.url
      };
      axios
        .post(`${process.env.baseUrl}/api/result`, formData)
        .then(response => {
          setTimeout(() => {
            this.$router.push(`/result/${response.data.urlToRedirect}`);
          }, 500),
            this.$toast.success("Шаблон для аудита создан", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  }
};
</script>
