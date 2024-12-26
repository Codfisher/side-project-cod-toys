<template>
  <div class="">
    我是 kaomoji-config 設定頁
    {{ config }}
  </div>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useConfigApi } from '../../composables/use-config-api'

const configApi = useConfigApi()

document.title = '顏文字設定'

const {
  state: config,
  isLoading: isConfigLoading,
  execute: refreshConfig,
} = useAsyncState(
  () => configApi.get(),
  undefined,
)
</script>

<style scoped lang="sass">
</style>
