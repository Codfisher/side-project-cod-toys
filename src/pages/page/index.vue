<template>
  <div class="flex-col">
    我是 page

    <page-card />
  </div>
</template>

<script setup lang="ts">
import PageCard from './page-card.vue'

definePage({
  meta: {
    label: 'page',
  },
})
</script>

<style scoped lang="sass">
</style>
