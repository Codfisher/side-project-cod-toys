<template>
  <div
    ref="pageRef"
    class="flex-col"
  >
    <main-input v-model="inputText" />

    <div
      :key="inputText"
      class="flex-col"
    >
      <feature-card-kaomoji v-model="inputText" />
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
import FeatureCardKaomoji from '../domains/feature-card-kaomoji/index.vue'
import { useFeatureStore } from '../stores/feature.store'

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
