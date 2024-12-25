<template>
  <feature-card-option
    v-if="visible"
    class="p-4"
    :action="() => mainApi.hideWindow()"
  >
    輸入任意文字後隱藏
  </feature-card-option>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FeatureCardOption from '../../components/feature-card-option.vue'
import { useMain } from '../../composables/use-main'

const mainApi = useMain()

const inputText = defineModel({ default: '' })

const visible = computed(() => !inputText.value)
const isFeature = computed(() => false)
</script>

<style scoped lang="sass">
</style>
