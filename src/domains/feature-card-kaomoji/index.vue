<template>
  <template v-if="visible">
    <feature-option
      v-if="!isFeature"
      class="p-4"
      icon="emoticon"
      text="輸入 @ 搜尋顏文字"
      :action="() => setText('@')"
    />

    <template v-else>
      <feature-option
        v-if="nextPageVisible"
        class="w-full px-4 py-1"
        :action="() => nextPage()"
      >
        <q-chip
          v-if="isFeature"
          label="Ctrl+1"
          square
          outline
          color="primary"
        />
        <span class="flex-1">
          下一頁 ({{ pagination.page + 1 }}/{{ totalPages }})
        </span>
      </feature-option>

      <feature-option
        v-for="item, i in paginationList"
        :key="i"
        class="w-full px-4 py-1"
        :action="() => copy(item.value)"
      >
        <q-chip
          v-if="isFeature"
          :label="`Ctrl+${i + 2}`"
          square
          outline
          color="primary"
        />

        <div class="flex-1">
          {{ item.value }}
        </div>

        <div class="flex">
          <q-chip
            v-for="tag in item.tags"
            :key="tag"
            :label="tag"
          />
        </div>
      </feature-option>

      <feature-option
        class="relative w-full bg-primary/10 p-4"
        :action="() => refreshData()"
      >
        <div class="w-full flex items-center justify-around">
          <span class="flex-1">
            更新資料
          </span>
          <span class="flex-1 text-right text-xs text-gray-500">
            共 {{ list.length }} 筆，最後更新於 {{ updatedAt.format('YYYY/MM/DD HH:mm:ss') }}
          </span>
        </div>

        <q-inner-loading :showing="isLoading" />
      </feature-option>
    </template>
  </template>
</template>

<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { computed, watch } from 'vue'
import FeatureOption from '../../components/feature-option.vue'
import { useMainApi } from '../../composables/use-main-api'
import { useFeatureStore } from '../../stores/feature.store'
import { useKaomojiData } from './use-kaomoji-data'

const mainApi = useMainApi()
const featureStore = useFeatureStore()

const inputText = defineModel({ default: '' })

const visible = computed(() => {
  return !inputText.value || inputText.value.startsWith('@')
})
const isFeature = computed(() => inputText.value.startsWith('@'))

function setText(text: string) {
  inputText.value = text
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  mainApi.hideWindow()
}

const {
  isLoading,
  updatedAt,
  pagination,
  paginationList,
  list,
  nextPage,
  totalPages,
  refreshData,
  init,
} = useKaomojiData(inputText)
init()

const nextPageVisible = computed(() => totalPages.value > 1)

const { current } = useMagicKeys()

watch(current, (keySet) => {
  // 僅使用此功能才作用，避免干擾其他功能
  if (!isFeature.value || keySet.size === 0)
    return

  if (!keySet.has('control'))
    return

  /** 1~6 */
  const numberKey = [...keySet].find((key) => key.match(/^[1-6]$/))
  if (numberKey) {
    const index = Number(numberKey) - 1
    featureStore.setOptionByIndex(index)
    featureStore.currentOption?.action()
  }
}, { deep: true })
</script>
