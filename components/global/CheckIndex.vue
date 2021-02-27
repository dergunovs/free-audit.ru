<template>
  <div>
    <p>
      Яндекс:<br />
      1) <a :href="`https://yandex.ru/search/?text=host:${url}`" target="_blank">без www</a> -
      <b>{{ yaPagesNumber }}</b> стр., 2)
      <a :href="`https://yandex.ru/search/?text=host:www.${url}`" target="_blank">с www</a> -
      <b>{{ yaPagesNumberWWW }}</b> стр.
    </p>
    <p>
      Гугл:<br />
      1)
      <a :href="`https://www.google.com/search?q=site:${url}+-inurl:www+-inurl:https`" target="_blank">без www</a> -
      <b>{{ gPagesNumber }}</b> стр., 2)
      <a :href="`https://www.google.com/search?q=site:${url}+inurl:www+-inurl:https`" target="_blank">с www</a> -
      <b>{{ gPagesNumberWWW }}</b> стр., 3)
      <a :href="`https://www.google.com/search?q=site:${url}+-inurl:www+inurl:https`" target="_blank">
        без www + https
      </a>
      - <b>{{ gPagesNumberHttps }}</b> стр., 4)
      <a :href="`https://www.google.com/search?q=site:${url}+inurl:www+inurl:https`" target="_blank">с www + https</a> -
      <b>{{ gPagesNumberHttpsWWW }}</b> стр.
    </p>
  </div>
</template>

<script>
export default {
  name: "CheckIndex",
  data: () => ({
    yaPagesNumber: "",
    yaPagesNumberWWW: "",
    gPagesNumber: "",
    gPagesNumberWWW: "",
    gPagesNumberHttps: "",
    gPagesNumberHttpsWWW: "",
  }),
  props: ["url"],
  mounted() {
    let formData = {
      url: this.url,
    };
    this.$axios
      .post(`/api/result/checkIndex/`, formData)
      .then((response) => {
        this.yaPagesNumber = response.data.yaPagesNumber;
        this.yaPagesNumberWWW = response.data.yaPagesNumberWWW;
        this.gPagesNumber = response.data.gPagesNumber;
        this.gPagesNumberWWW = response.data.gPagesNumberWWW;
        this.gPagesNumberHttps = response.data.gPagesNumberHttps;
        this.gPagesNumberHttpsWWW = response.data.gPagesNumberHttpsWWW;
      })
      .catch((err) => this.$toast.error(err.response.data.message, { duration: 5000 }));
  },
};
</script>
