<template>
  <q-form
    class="flex-col gap-6 p-6"
    @submit="handleSubmit"
  >
    <q-input
      v-model="form.databaseId"
      outlined
      label="databaseId"
    />

    <q-input
      v-model="form.token"
      outlined
      label="token"
    />

    <q-btn
      label="儲存"
      type="submit"
      unelevated
      color="primary"
    />
  </q-form>
</template>

<script setup lang="ts">
import type { UserConfig } from '../../../electron/electron-env'
import { useAsyncState } from '@vueuse/core'
import { clone } from 'remeda'
import { ref } from 'vue'
import { useConfigApi } from '../../composables/use-config-api'

const configApi = useConfigApi()

document.title = '顏文字設定'

const form = ref<UserConfig['kaomoji']>({
  databaseId: '',
  token: '',
})

const {
  state: config,
  isLoading: isConfigLoading,
  execute: refreshConfig,
} = useAsyncState(
  () => configApi.get(),
  undefined,
  {
    onSuccess(data) {
      if (data) {
        form.value = data.kaomoji
      }
    },
  },
)

function handleSubmit() {
  // clone 處理，避免 Error: An object could not be cloned
  configApi.update(clone({
    kaomoji: form.value,
  }))
}
</script>

<style scoped lang="sass">
</style>
