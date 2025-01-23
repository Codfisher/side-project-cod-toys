import type { UserConfig } from '../../../electron/electron-env'
import { Client } from '@notionhq/client'
import { useAsyncState } from '@vueuse/core'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'
import { get } from 'lodash-es'
import PQueue from 'p-queue'
import { chunk, flatMap, forEach, join, map, pipe, piped, prop, reduce, tap, unique } from 'remeda'
import { computed, nextTick, ref, type Ref, shallowRef, triggerRef, watch } from 'vue'
import { useConfigApi } from '../../composables/use-config-api'
import { useLlmApi } from '../../composables/use-llm-api'
import { useFeatureStore } from '../../stores/feature.store'

export function useKaomojiData(
  inputText: Ref<string>,
) {
  const llmApi = useLlmApi()
  const configApi = useConfigApi()
  const featureStore = useFeatureStore()

  const {
    state: config,
    execute: refreshConfig,
  } = useAsyncState(
    () => configApi.get(),
    undefined,
    { immediate: false },
  )

  let notionClient: Client | undefined
  function initNotionClient(config: UserConfig) {
    notionClient = new Client({
      auth: config.kaomoji.token,
    })
  }

  const updatedAt = shallowRef(dayjs())
  const notionData = shallowRef<any[]>([])
  const startCursor = ref('')
  const {
    isLoading,
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
      immediate: false,
      onSuccess(result) {
        notionData.value.push(...(result?.results ?? []))

        if (result?.has_more && result.next_cursor) {
          startCursor.value = result.next_cursor
          getData()
          return
        }

        triggerRef(notionData)
        updatedAt.value = dayjs()
      },
    },
  )

  function refreshData() {
    startCursor.value = ''
    notionData.value = []
    getData()
  }

  interface ListItem {
    value: string;
    tags: string[];
  }
  const list = computed(() => pipe(
    notionData.value,
    reduce((acc: ListItem[], result) => {
      acc.push({
        // @notionhq/client 的型別與實際資料有點出入，自行從回應判斷
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
    }, []),
  ))

  const tagSynonymMap = shallowRef(new Map<string, string>())
  const tagSynonymQueue = new PQueue({
    concurrency: 1,
    timeout: 1000 * 60 * 5,
  })
  watch(list, piped(
    // 先清空 tagSynonymQueue
    tap(() => {
      tagSynonymQueue.clear()
    }),
    flatMap((item) => item.tags),
    unique(),
    forEach((tag) => {
      tagSynonymQueue.add(async () => {
        const synonym = await llmApi.prompt(
          `${tag}的 5 個繁體中文近義詞，5 個英文近義詞，全部合併，逗號分隔，不要任何附加資訊，不要標題，不需解釋`,
        )
        tagSynonymMap.value.set(tag, synonym)
        triggerRef(tagSynonymMap)
      })
    }),
  ))

  const listWithSynonym = computed(() => pipe(
    list.value,
    map((item) => {
      /** 全部拼在一起即可 */
      const synonym = pipe(
        item.tags,
        map((tag) => tagSynonymMap.value.get(tag) ?? ''),
        join(','),
      )

      return {
        ...item,
        synonym,
      }
    }),
  ))

  const fuseInstance = new Fuse(listWithSynonym.value, {
    keys: ['tags', 'synonym'],
  })
  watch(listWithSynonym, (value) => {
    fuseInstance.setCollection(value)
  })

  const filteredList = computed(() => {
    if (inputText.value === '@') {
      return listWithSynonym.value
    }

    const text = pipe(
      inputText.value,
      (value) => {
        if (value.startsWith('@')) {
          return value.slice(1)
        }

        return value
      },
      (value) => value.trim(),
    )

    const result = fuseInstance.search(text)

    return pipe(
      result,
      map(prop('item')),
    )
  })

  const pagination = ref({
    page: 0,
    itemsPerPage: 5,
  })
  watch(inputText, () => {
    pagination.value.page = 0
  })

  const totalPages = computed(() => Math.ceil(
    filteredList.value.length / pagination.value.itemsPerPage,
  ))

  const paginationList = computed(() => pipe(
    filteredList.value,
    chunk(pagination.value.itemsPerPage),
    (data) => data[pagination.value.page] ?? [],
  ))

  async function nextPage() {
    pagination.value.page += 1
    pagination.value.page %= totalPages.value

    await nextTick()
    featureStore.setOptionByIndex(0)
  }

  configApi.onUpdate(async (config) => {
    init(config)
  })

  async function init(config?: UserConfig) {
    const _config = config ?? await refreshConfig()
    if (!_config) {
      return
    }

    initNotionClient(_config)
    refreshData()
  }

  return {
    isLoading,
    updatedAt,

    list,

    pagination,
    paginationList,
    totalPages,
    nextPage,

    init,
    refreshData,
  }
}
