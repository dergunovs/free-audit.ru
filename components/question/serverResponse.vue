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
  computed: {
    mainVersion() {
      return this.$store.state.mainVersion;
    }
  },
  methods: {
    isOk(code) {
      if (code == "200") {
        return true;
      }
    }
  },
  watch: {
    mainVersion: function() {
      let formData = {
        url: this.url,
        mainVersion: this.mainVersion
      };
      axios
        .post(`${process.env.baseUrl}/api/result/serverResponse/`, formData)
        .then(response => {
          this.statusList = response.data;
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  },
  mounted() {
    let formData = {
      url: this.url,
      mainVersion: this.mainVersion
    };
    axios
      .post(`${process.env.baseUrl}/api/result/serverResponse/`, formData)
      .then(response => {
        this.statusList = response.data;
      })
      .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
  }
};
</script>
