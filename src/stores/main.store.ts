import { useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const [drawerVisible, toggleDrawerVisible] = useToggle(true)

  return {
    drawerVisible: computed(() => drawerVisible.value),
    toggleDrawerVisible,
  }
})
