<template>
  <div>
    <div v-for="status in statusList" :key="status.index">
      <div v-for="(code, url) in status" :key="code">
        <a :href="`${url}`" target="_blank" rel="nofollow">{{ url }}</a> -
        <b v-bind:class="{ green: isOk(code) }">{{ code }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckResponse",
  data: () => ({
    statusList: [],
  }),
  props: ["url"],
  computed: {
    urlPrefix() {
      return this.$store.state.urlPrefix;
    },
  },
  methods: {
    isOk(code) {
      if (code == "200") {
        return true;
      }
    },
  },
  watch: {
    urlPrefix: function () {
      let formData = {
        url: this.url,
        urlPrefix: this.urlPrefix,
      };
      this.$axios
        .post(`/api/result/serverResponse/`, formData)
        .then((response) => {
          this.statusList = response.data;
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    },
  },
  mounted() {
    if (this.urlPrefix) {
      let formData = {
        url: this.url,
        urlPrefix: this.urlPrefix,
      };
      this.$axios
        .post(`/api/result/serverResponse/`, formData)
        .then((response) => {
          this.statusList = response.data;
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  },
};
</script>
