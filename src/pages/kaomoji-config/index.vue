<template>
  <q-form
    class="relative flex-col gap-6 p-6"
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

    <q-inner-loading :showing="isLoading" />
  </q-form>
</template>

<script setup lang="ts">
import type { UserConfig } from '../../../electron/electron-env'
import { useAsyncState } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { clone } from 'remeda'
import { ref } from 'vue'
import { useConfigApi } from '../../composables/use-config-api'

const configApi = useConfigApi()
const $q = useQuasar()

document.title = '顏文字設定'

const form = ref<UserConfig['kaomoji']>({
  databaseId: '',
  token: '',
})

const {
  isLoading,
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
  })).then(() => {
    $q.notify({
      type: 'positive',
      message: '儲存成功',
    })
  }).catch(() => {
    $q.notify({
      type: 'negative',
      message: '儲存失敗',
    })
  })
}
</script>

<style scoped lang="sass">
</style>
