<template>
  <div
    ref="pageRef"
    class="flex-col"
  >
    <main-input v-model="inputText" />

    <!-- FIX: 解決 option id 順序問題 -->
    <div
      :key="inputText"
      class="flex-col"
    >
      <component
        :is="card"
        v-for="card, key in featureCards"
        :key
        v-model="inputText"
      />

      <feature-card-google v-model="inputText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useWindowFocus, whenever } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import MainInput from '../components/main-input.vue'
import { useMain } from '../composables/use-main'
import FeatureCardGoogle from '../domains/feature-card-google/index.vue'
import { useFeatureStore } from '../stores/feature.store'

const featureCards = import.meta.glob([
  '../domains/feature-card-*/index.vue',
  '!../domains/feature-card-google/index.vue',
], {
  import: 'default',
  eager: true,
})

const featureStore = useFeatureStore()
const mainApi = useMain()

const inputText = ref('')

// 同步視窗與頁面高度
const pageRef = ref<HTMLDivElement>()
const { height } = useElementBounding(pageRef)

watchEffect(() => {
  mainApi.updateHeight(height.value)
})

// 視窗 blur 時，清空 inputText
const focused = useWindowFocus()
whenever(
  () => !focused.value,
  () => {
    featureStore.setOption('')
    inputText.value = ''

    mainApi.hideWindow()
  },
)
</script>

<style scoped lang="sass">
</style>
