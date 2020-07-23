<template>
  <div>
    <headerComponent />
    <div class="center">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  },
  components: {
    headerComponent: () => import("~/components/headerComponent.vue")
  }
};
</script>
