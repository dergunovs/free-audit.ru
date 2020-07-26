<template>
  <div>
    <h1>Бесплатный онлайн аудит сайта</h1>
    <ValidationObserver class="form form-center" v-slot="{ invalid }" tag="div">
      <ValidationProvider rules="required" v-slot="{ errors }" class="group w12" tag="div">
        <select v-model="type" class="input">
          <option value="">Выбрать тип аудита</option>
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
        class="group w25"
        tag="div"
      >
        <input type="text" v-model="url" placeholder="Введите адрес сайта без http или https" class="input" />
        <span class="error-message">{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="group w12">
        <button v-on:click="auditStart" :disabled="invalid" class="input button">Начать аудит</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import axios from "axios";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    type: "",
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
  methods: {
    auditStart() {
      console.log("Начало аудита");
    }
  }
};
</script>
