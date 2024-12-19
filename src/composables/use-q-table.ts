import type { PaginatedData } from '@project-code/shared'
import type { UseAsyncStateOptions } from '@vueuse/core'
import type { QTable } from 'quasar'
import type { Ref } from 'vue'
import { syncRef, useAsyncState } from '@vueuse/core'
import { onMounted, ref } from 'vue'

type StateOption<T> = UseAsyncStateOptions<true, PaginatedData<T>>

interface UseQTableParam<T> {
  find: (data: { skip: number; limit: number }) => Promise<PaginatedData<T>>;
  onError?: StateOption<T>['onError'];
  onSuccess?: StateOption<T>['onSuccess'];
  pagination?: {
    sortBy?: string;
    descending?: boolean;
    page?: number;
    rowsPerPage?: number;
    rowsNumber?: number;
  };
  immediate?: boolean;
}

/** 集結 QTable 常用參數 */
export function useQTable<T>(param: UseQTableParam<T>) {
  const tableRef = ref<QTable>()
  const { immediate = true } = param

  const pagination = ref({
    sortBy: '',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10,
    ...param.pagination,
  })

  const { state: data, execute, isLoading } = useAsyncState(() => {
    const limit = pagination.value.rowsPerPage
    const skip = (pagination.value.page - 1) * limit

    return param.find({ skip, limit })
  }, {
    total: 0,
    skip: 0,
    limit: 0,
    data: [],
  }, {
    immediate: false,
    resetOnExecute: false,
    onError: param.onError,
    onSuccess: param.onSuccess,
  })

  const rows = ref<T[]>([]) as Ref<T[]>
  syncRef(data, rows, {
    transform: {
      ltr: (data) => {
        pagination.value.rowsNumber = data.total
        return data.data
      },
    },
    deep: true,
    direction: 'ltr',
  })

  const handleRequest: QTable['onRequest'] = async (props) => {
    const { page, rowsPerPage, sortBy, descending } = props.pagination

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending

    await execute()
  }

  onMounted(() => {
    if (immediate) {
      tableRef.value?.requestServerInteraction()
    }
  })

  return {
    tableRef,
    isLoading,
    /** 分頁資料 */
    pagination,
    /** 取得資料 */
    rows,
    /** 接收 QTable request 事件 */
    handleRequest,
    /** 執行查詢資料 */
    execute,
  }
}
