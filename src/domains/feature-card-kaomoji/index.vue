<template>
  <div v-if="visible">
    <feature-option
      v-if="!isFeature"
      class="p-4"
      icon="emoticon"
      text="輸入 @ 搜尋顏文字"
      :action="() => setText('@')"
    />

    <template v-else>
      <feature-option
        v-for="text, i in textList"
        :key="i"
        class="p-4"
        :text
        :action="() => copy(text)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FeatureOption from '../../components/feature-option.vue'
import { useMainApi } from '../../composables/use-main-api'

const mainApi = useMainApi()

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
