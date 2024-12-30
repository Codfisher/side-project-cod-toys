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
        v-for="item, i in filteredList"
        :key="i"
        class="w-full p-4"
        :action="() => copy(item.value)"
      >
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

        <q-inner-loading :showing="isDataLoading" />
      </feature-option>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { UserConfig } from '../../../electron/electron-env'
import { Client } from '@notionhq/client'
import { useAsyncState } from '@vueuse/core'
import dayjs from 'dayjs'
import { get } from 'lodash-es'
import { useQuasar } from 'quasar'
import { pipe, take } from 'remeda'
import { computed, ref, shallowRef, triggerRef } from 'vue'
import FeatureOption from '../../components/feature-option.vue'
import { useConfigApi } from '../../composables/use-config-api'
import { useMainApi } from '../../composables/use-main-api'

const mainApi = useMainApi()
const configApi = useConfigApi()
const $q = useQuasar()

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
  state: config,
  execute: refreshConfig,
} = useAsyncState(
  () => configApi.get(),
  undefined,
  {
    immediate: false,
    onSuccess(data) {
      if (data) {
        initNotionClient(data)
      }
    },
  },
)

let notionClient: Client | undefined
function initNotionClient(config: UserConfig) {
  notionClient = new Client({
    auth: config.kaomoji.token,
  })
}

const updatedAt = ref(dayjs())
const data = shallowRef<any[]>([])
const startCursor = ref('')
const {
  isLoading: isDataLoading,
  execute: getData,
} = useAsyncState(
  async () => {
    const databaseId = config.value?.kaomoji.databaseId
    if (!databaseId) {
      throw new Error('尚未設定 databaseId')
    }

    return notionClient?.databases.query({
      database_id: databaseId,
      start_cursor: startCursor.value ? startCursor.value : undefined,
    })
  },
  undefined,
  {
    resetOnExecute: false,
    immediate: false,
    onSuccess(result) {
      data.value.push(...(result?.results ?? []))

      if (result?.has_more && result.next_cursor) {
        startCursor.value = result.next_cursor
        getData()
        return
      }

      triggerRef(data)
      updatedAt.value = dayjs()
    },
  },
)

function refreshData() {
  startCursor.value = ''
  data.value = []
  getData()
}

interface ListItem {
  value: string;
  tags: string[];
}
const list = computed(() => {
  return data.value?.reduce((acc: ListItem[], result) => {
    acc.push({
      // @notionhq/client 的型別有點出入，自行從回應中取值
      value: get(result, 'properties.value.title[0].plain_text', '') as string,
      tags: pipe(
        get(result, 'properties.tags.multi_select', []) as { name: string }[],
        (value) => {
          if (!value) {
            return []
          }

          return value.map((item) => item.name)
        },
      ),
    })

    return acc
  }, [])
})

const filteredList = computed(() => pipe(
  list.value,
  take(5),
))

configApi.onUpdate(async (config) => {
  initNotionClient(config)
  refreshData()
})

async function init() {
  const config = await refreshConfig()
  if (!config) {
    return
  }

  initNotionClient(config)
  refreshData()
}
init()
</script>

<style scoped lang="sass">
</style>
