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
import axios from "axios";

export default {
  data: () => ({
    statusList: []
  }),
  props: ["url", "answers", "answerPicked"],
  computed: {
    urlPicked: function() {
      return this.answers.filter(answer => {
        if (answer._id == this.answerPicked) {
          return answer;
        }
      });
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
    answerPicked: function() {
      let urlPrefix = this.urlPicked[0].name;
      this.$store.commit("saveUrlPrefix", urlPrefix);
    }
  },
  mounted() {
    let formData = {
      url: this.url
    };
    axios
      .post(`${process.env.baseUrl}/api/result/urlPrefix/`, formData)
      .then(response => {
        this.statusList = response.data;
      })
      .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    if (this.urlPicked[0]) {
      let urlPrefix = this.urlPicked[0].name;
      this.$store.commit("saveUrlPrefix", urlPrefix);
    }
  }
};
</script>
