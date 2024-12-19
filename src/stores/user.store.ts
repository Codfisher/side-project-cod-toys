import type { ServerInferRequest } from '@ts-rest/core'
import {
  authContract,
  userContract,
} from '@project-code/shared'
import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import {
  useClient,
} from '../common/api'

type LocalLoginParam = ServerInferRequest<typeof authContract.localLogin>

export const useUserStore = defineStore('user', () => {
  const authApi = useClient(authContract)
  const userApi = useClient(userContract)

  const {
    state: user,
    isLoading,
    execute: refresh,
  } = useAsyncState(() => userApi.getSelf(), undefined, {
    resetOnExecute: false,
  })

  async function login(param: LocalLoginParam['body']) {
    const { status } = await authApi.localLogin({
      body: param,
    })

    if (status >= 400) {
      throw new Error('帳號密碼錯誤')
    }

    await refresh()
  }

  async function logout() {
    const { status } = await authApi.logout()

    if (status >= 400) {
      throw new Error('登出失敗')
    }

    await refresh()
  }

  return {
    isLoading,
    user: computed(() => {
      if (user.value?.status === 200) {
        return user.value?.body
      }

      return undefined
    }),
    refresh,
    login,
    logout,
  }
})
