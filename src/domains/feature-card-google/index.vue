<template>
  <feature-card-option
    class="p-4"
    :action="search"
  >
    在 Google 上搜尋
  </feature-card-option>
</template>

<script setup lang="ts">
import FeatureCardOption from '../../components/feature-card-option.vue'
import { useMain } from '../../composables/use-main'

const mainApi = useMain()

const inputText = defineModel({ default: '' })

function search() {
  const url = `https://www.google.com/search?q=${encodeURIComponent(inputText.value)}`
  mainApi.openExternal(url)
  mainApi.hideWindow()
}
</script>

<style scoped lang="sass">
</style>
