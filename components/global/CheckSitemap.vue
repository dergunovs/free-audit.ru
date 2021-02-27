<template>
  <div v-if="status">
    <a :href="`${urlPrefix}${url}/sitemap.xml`" target="_blank" rel="nofollow"> {{ urlPrefix }}{{ url }}/sitemap.xml</a>
    - <b v-bind:class="{ green: isOk(status) }">{{ status }}</b>
  </div>
</template>

<script>
export default {
  name: "CheckSitemap",
  data: () => ({
    status: "",
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
        .post(`/api/result/checkSitemap/`, formData)
        .then((response) => {
          this.status = response.data;
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
        .post(`/api/result/checkSitemap/`, formData)
        .then((response) => {
          this.status = response.data;
        })
        .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  },
};
</script>
