<template>
  <div>
    <h1>{{ result.url }}</h1>
    <div class="text-center">Дата создания {{ $dateFns.format(new Date(result.date_created), "dd.MM.yyyy г.") }}</div>
    {{ result.audit }}
  </div>
</template>

<script>
import axios from "axios";

import Editor from "@tinymce/tinymce-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data: () => ({
    url: "",
    audit: "",
    date_created: ""
  }),
  async asyncData({ params }) {
    try {
      const data = await axios.get(`${process.env.baseUrl}/api/result/${params.id}`);
      return { result: data.data };
    } catch (err) {
      console.log(err);
    }
  },
  components: {
    Editor,
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    resultUpdate() {
      let formData = {
        url: this.url
      };
      axios
        .patch(`${process.env.baseUrl}/api/result/${this.result._id}`)
        .then(response => {
          this.result.url = response.data.url;
          this.$toast.success("Готово", { duration: 1000 });
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
    resultDelete() {
      axios
        .delete(`${process.env.baseUrl}/api/result/${this.result._id}`)
        .then(
          setTimeout(() => {
            this.$router.push(`/result/`);
          }, 500),
          this.$toast.success("Готово", { duration: 1000 })
        )
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  },
  mounted() {
    this.url = this.result.url;
  }
};
</script>
