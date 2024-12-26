<template>
  <template v-if="visible">
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
  </template>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import FeatureOption from '../../components/feature-option.vue'
import { useConfigApi } from '../../composables/use-config-api'
import { useMainApi } from '../../composables/use-main-api'

const mainApi = useMainApi()
const configApi = useConfigApi()
const $q = useQuasar()

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
  '(*´∀`)~♥',
]

const {
  state: config,
  isLoading: isConfigLoading,
} = useAsyncState(
  () => configApi.get(),
  undefined,
)

configApi.onUpdate((config) => {
  $q.notify({
    message: `設定已更新 : ${config}`,
    type: 'positive',
  })
})
</script>

<style scoped lang="sass">
</style>
