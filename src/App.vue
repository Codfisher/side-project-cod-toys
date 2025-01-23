<template>
  {{ ans }}
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useLlmApi } from './composables/use-llm-api'

const $q = useQuasar()
/** 自動映射 icon，加上 sym_r 前綴。https://quasar.dev/vue-components/icon#custom-mapping */
$q.iconMapFn = (iconName) => ({
  icon: iconName.includes('sym_r') ? iconName : `sym_r_${iconName}`,
})

const llmApi = useLlmApi()

const ans = ref('')
llmApi.prompt('你好 gemma').then((answer) => {
  ans.value = answer
})
</script>

<style lang="sass">
html, body, #app
  width: 100%
  height: 100%
  padding: 0
  margin: 0
  overflow: hidden

#app
  display: flex
  flex-direction: column
</style>
