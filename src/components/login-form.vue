<template>
  <div class="box flex overflow-hidden rounded-xl">
    <!-- <q-img
      class="w-[25rem]"
      :src="img"
    /> -->

    <!-- 輸入區 -->
    <div class="w-[25rem] flex flex-col bg-[#FAFAFA] p-4">
      <div class="mt-6 flex flex-col text-center text-[#6F6F6F]">
        <div class="text-xl font-bold">
          登入後台系統
        </div>
        <div class="text-xs">
          輸入帳號密碼後即可登入後台使用系統
        </div>
      </div>

      <!-- 帳號密碼 -->
      <q-form
        class="mt-8 flex flex-col flex-1 items-center gap-5 pb-8"
        @submit="handleSubmit"
      >
        <q-input
          v-bind="inputProps"
          v-model="data.username"
          label="使用者名稱"
          :rules="notEmptyRule"
        />
        <q-input
          v-bind="inputProps"
          v-model="data.password"
          label="密碼"
          type="password"
          :rules="notEmptyRule"
        />
        <q-space />

        <q-btn
          label="登入"
          unelevated
          color="primary"
          class="px-24 py-4"
          type="submit"
        />
      </q-form>

      <div class="text-center text-sm text-gray-500">
        Powered by BGMotion®
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import to from 'await-to-js'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { createRule, notEmpty } from '../common/validator'
import { useUserStore } from '../stores/user.store'

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error', value: Error): void;
}>()

const inputProps = {
  outlined: true,
  class: ' w-5/6',
  bgColor: 'white',
}

const data = ref({
  username: '',
  password: '',
})

const $q = useQuasar()
const userStore = useUserStore()

const notEmptyRule = createRule([notEmpty], '請輸入文字')

async function handleSubmit() {
  if (!data.value.username || !data.value.password) {
    $q.notify({
      type: 'negative',
      message: `請輸入帳號密碼`,
    })
    return
  }

  const [err] = await to(userStore.login(data.value))
  if (err) {
    $q.notify({
      type: 'negative',
      message: `帳號密碼錯誤`,
    })
    return
  }

  $q.notify({
    type: 'positive',
    message: `登入成功`,
  })

  emit('success')
}
</script>

<style scoped lang="sass">
</style>
