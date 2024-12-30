<template>
  <div
    ref="pageRef"
    class="flex-col"
  >
    <main-input v-model="inputText" />

    <div class="flex-col">
      <component
        :is="card"
        v-for="card, key in featureCards"
        :key
        v-model="inputText"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useWindowFocus, whenever } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import MainInput from '../components/main-input.vue'
import { useMainApi } from '../composables/use-main-api'
import { useFeatureStore } from '../stores/feature.store'

const featureCards = import.meta.glob('../domains/feature-card-*/index.vue', {
  import: 'default',
  eager: true,
})

const featureStore = useFeatureStore()
const mainApi = useMainApi()

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

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Orbitron:wght@400..900&family=Oxanium:wght@200..800&display=swap')

html, body
  font-family: "Noto Sans TC", serif
  font-optical-sizing: auto
  font-style: normal
</style>
