import { createEventHook } from '@vueuse/core'
import { defineStore } from 'pinia'
import { pipe, sortBy } from 'remeda'
import { computed, ref } from 'vue'

export const useFeatureStore = defineStore('feature', () => {
  const selectedOptionId = ref('')
  const optionIdList = ref<string[]>([])

  const enterHook = createEventHook<{ optionId: string }>()
  function submitEnter() {
    enterHook.trigger({ optionId: selectedOptionId.value })
  }

  return {
    optionIdList: computed(() => pipe(
      optionIdList.value,
      /** 依照數字排序，保證 option 順序 */
      sortBy((id) => Number.parseInt(id.replace(/\D/g, ''), 10)),
    )),
    addOptionId(id: string) {
      optionIdList.value.push(id)
    },
    removeOptionId(id: string) {
      const index = optionIdList.value.indexOf(id)
      if (index !== -1) {
        optionIdList.value.splice(index, 1)
      }
    },

    selectedOptionId,
    nextOption() {
      const first = optionIdList.value.at(0)

      const index = optionIdList.value.indexOf(selectedOptionId.value)
      if (index < 0 && first) {
        selectedOptionId.value = first
        return
      }

      const target = optionIdList.value[index + 1]
      if (target || first) {
        selectedOptionId.value = (target ?? first)!
      }
    },
    prevOption() {
      const last = optionIdList.value.at(-1)

      const index = optionIdList.value.indexOf(selectedOptionId.value)
      if (index < 0 && last) {
        selectedOptionId.value = last
        return
      }

      const target = optionIdList.value[index - 1]
      if (target || last) {
        selectedOptionId.value = (target ?? last)!
      }
    },

    submitEnter,
    onEnter: enterHook.on,
  }
})
