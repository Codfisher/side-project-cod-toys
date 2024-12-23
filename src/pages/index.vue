<template>
  <div
    ref="pageRef"
    class="flex-col"
  >
    <q-input
      v-model="inputText"
      placeholder="要來點甚麼？...(´,,•ω•,,)"
      autofocus
      outlined
      square
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="flex-col">
      <feature-card-kaomoji :input-text />
      <feature-card-ex :input-text />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useWindowFocus, whenever } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import FeatureCardEx from '../components/feature-card-ex.vue'
import FeatureCardKaomoji from '../components/feature-card-kaomoji.vue'
import { useMain } from '../composables/use-main'

const mainApi = useMain()

const inputText = ref('')
const selectedOptionId = ref('')

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
  () => inputText.value = '',
)
</script>

<style scoped lang="sass">
</style>
