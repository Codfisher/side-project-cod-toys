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
        v-for="item, i in list"
        :key="i"
        class="p-4"
        :text="item.value"
        :action="() => copy(item.value)"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import type { UserConfig } from '../../../electron/electron-env'
import { Client } from '@notionhq/client'
import { useAsyncState } from '@vueuse/core'
import { get } from 'lodash-es'
import { useQuasar } from 'quasar'
import { pipe } from 'remeda'
import { computed } from 'vue'
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

const {
  state: data,
  isLoading: isDataLoading,
  execute: refreshData,
} = useAsyncState(
  async () => {
    const databaseId = config.value?.kaomoji.databaseId
    if (!databaseId) {
      throw new Error('尚未設定 databaseId')
    }

    return notionClient?.databases.query({
      database_id: databaseId,
    })
  },
  undefined,
  {
    resetOnExecute: false,
    immediate: false,
    onSuccess(data) {
      console.log(`🚀 ~ [notionClient] data:`, data)
    },
  },
)

interface ListItem {
  value: string;
  tags: string[];
}
const list = computed(() => {
  return data.value?.results.reduce((acc: ListItem[], result) => {
    acc.push({
      value: get(result, 'properties.value.title[0].plain_text', '') as string,
      tags: pipe(
        get(result, 'properties.tags.multi_select', []) as any,
        (value: { name: string }[]) => {
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

configApi.onUpdate(async (config) => {
  initNotionClient(config)
  refreshData()
})

async function init() {
  const config = await refreshConfig()

  if (config) {
    initNotionClient(config)
    refreshData()
  }
}
init()
</script>

<style scoped lang="sass">
</style>
