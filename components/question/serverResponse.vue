<template>
  <div>
    <p>Код ответа сервера: {{ status }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    status: ""
  }),
  props: ["siteUrl"],
  mounted() {
    let formData = {
      url: this.siteUrl
    };
    axios
      .post(`${process.env.baseUrl}/api/result/cors/`, formData)
      .then(response => {
        this.status = response.data;
      })
      .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
  }
};
</script>
