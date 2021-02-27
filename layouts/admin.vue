<template>
  <div>
    <TheHeader />
    <div class="content center">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }],
    };
  },
};
</script>
