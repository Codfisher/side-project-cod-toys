<template>
  <q-input
    v-model="inputText"
    placeholder="要來點甚麼？...(´,,•ω•,,)"
    autofocus
    outlined
    square
    @keydown="handleKeydown"
  >
    <template #prepend>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import { useFeatureStore } from '../stores/feature.store'

const inputText = defineModel({ default: '' })
const featureStore = useFeatureStore()

// 當 option 剩一個時，自動選取
whenever(
  () => featureStore.optionIdList.length === 1,
  () => {
    const target = featureStore.optionIdList[0]
    if (target) {
      featureStore.setOption(target)
    }
  },
  { deep: true },
)

const keydownEventMap: Record<
  /** key name */
  string,
  (event: KeyboardEvent) => Promise<void>
> = {
  async Escape() {
    inputText.value = ''
  },
  async ArrowDown(event) {
    event.preventDefault()
    featureStore.nextOption()
  },
  async ArrowUp(event) {
    event.preventDefault()
    featureStore.prevOption()
  },
  async Enter() {
    featureStore.currentOption?.action()
  },
}
function handleKeydown(event: KeyboardEvent) {
  keydownEventMap[event.key]?.(event)
}
</script>

<style scoped lang="sass">
</style>
