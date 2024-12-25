<template>
  <div v-if="visible">
    <feature-card-option
      v-if="!isFeature"
      class="p-4"
      :action="() => setText('@')"
    >
      輸入 @ 搜尋顏文字
    </feature-card-option>

    <template v-else>
      <feature-card-option
        v-for="text, i in textList"
        :key="i"
        class="p-4"
        :action="() => copy(text)"
      >
        {{ text }}
      </feature-card-option>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FeatureCardOption from '../../components/feature-card-option.vue'
import { useMain } from '../../composables/use-main'

const mainApi = useMain()

const inputText = defineModel({ default: '' })

const visible = computed(() => {
  return !inputText.value || inputText.value.startsWith('@')
})

const isFeature = computed(() => inputText.value.startsWith('@'))

function setText(text: string) {
  inputText.value = text
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  mainApi.hideWindow()
}

const textList = [
  '(´▽`ʃ♡ƪ)',
  '੭ ˙ᗜ˙ )੭',
  'ヽ(✿ﾟ▽ﾟ)ノ',
]
</script>

<style scoped lang="sass">
</style>
