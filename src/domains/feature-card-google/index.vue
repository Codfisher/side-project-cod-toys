<template>
  <feature-option
    v-if="visible"
    class="p-4"
    icon="search"
    text="在 Google 上搜尋"
    :action
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FeatureOption from '../../components/feature-option.vue'
import { useMain } from '../../composables/use-main'

const mainApi = useMain()

const inputText = defineModel({ default: '' })

const visible = computed(() => {
  if (!inputText.value) {
    return false
  }

  return !inputText.value.startsWith('@')
})

function action() {
  const url = [
    `https://www.google.com/search?q=`,
    encodeURIComponent(inputText.value),
  ].join('')
  mainApi.openExternal(url)
  mainApi.hideWindow()
}
</script>

<style scoped lang="sass">
</style>
