<template>
  <div>
    <div v-for="status in statusList" :key="status.index">
      <div v-for="(code, url) in status" :key="code">
        {{ url }} - <b v-bind:class="{ green: isOk(code) }">{{ code }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    statusList: []
  }),
  props: ["url"],

  methods: {
    isOk(code) {
      if (code == "200") {
        return true;
      }
    }
  },
  mounted() {
    let formData = {
      url: this.url
    };
    axios
      .post(`${process.env.baseUrl}/api/result/mainVersion/`, formData)
      .then(response => {
        this.statusList = response.data;
      })
      .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
  }
};
</script>
