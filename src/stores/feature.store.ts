import { defineStore } from 'pinia'
import { pipe, sortBy } from 'remeda'
import { computed, ref, shallowRef, triggerRef } from 'vue'

interface OptionValue {
  action: () => void;
}

export const useFeatureStore = defineStore('feature', () => {
  const optionMap = shallowRef(new Map<string, OptionValue>())
  const optionIdList = computed(() => pipe(
    [...optionMap.value.keys()],
    /** 依照數字排序，保證 option 順序 */
    sortBy((id) => Number.parseInt(id.replace(/\D/g, ''), 10)),
  ))

  function addOption(id: string, value: OptionValue) {
    optionMap.value.set(id, value)
    triggerRef(optionMap)
  }
  function removeOption(id: string) {
    optionMap.value.delete(id)
    triggerRef(optionMap)
  }

  const selectedOptionId = ref('')
  function setOption(id: string) {
    selectedOptionId.value = id
  }
  function nextOption() {
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
  }
  function prevOption() {
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
  }

  const currentOption = computed(() => optionMap.value.get(selectedOptionId.value))

  return {
    optionIdList,
    addOption,
    removeOption,

    selectedOptionId,
    setOption,
    nextOption,
    prevOption,

    currentOption,
  }
})
