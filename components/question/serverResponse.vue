<template>
  <div>
    {{ siteUrl }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["siteUrl"],
  methods: {
    getResponseCodes() {
      axios
        .get(`${siteUrl}`, {
          headers: {}
        })
        .then(response => {
          console.log(response);
          var eventsUpdated = response.data.events;
          this.$emit("eventCreate", eventsUpdated);
        })
        .catch(err => this.$toast.error(err.response.data.message, { duration: 5000 }));
    }
  }
};
</script>
