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
  components: {
    headerComponent: () => import("~/components/headerComponent.vue")
  }
};
</script>
