<template>
  <feature-card-option
    v-if="visible"
    class="p-4"
  >
    輸入任意文字後隱藏
  </feature-card-option>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FeatureCardOption from './feature-card-option.vue'

const inputText = defineModel({ default: '' })

const visible = computed(() => !inputText.value)
const isFeature = computed(() => false)
</script>

<style scoped lang="sass">
</style>
