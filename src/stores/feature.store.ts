import { defineStore } from 'pinia'
import { map, pipe, sortBy } from 'remeda'
import { computed, ref, shallowRef, triggerRef } from 'vue'

interface OptionValue {
  y: number;
  action: () => void;
}

export const useFeatureStore = defineStore('feature', () => {
  const optionMap = shallowRef(new Map<string, OptionValue>())
  const optionIdList = computed(() => pipe(
    [...optionMap.value.entries()],
    /** 依照畫面 y 座標排序，保證 option 自然順序 */
    sortBy((data) => data[1].y),
    map(([id]) => id),
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
