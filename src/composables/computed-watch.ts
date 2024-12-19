import type { UnwrapRef, WatchCallback, WatchSource } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ref, watch } from 'vue'

type ComputedWatchCallback<V, OV, S, OnCleanup> = (value: V, oldValue: OV, onCleanup: OnCleanup) => S

/** 解決 computed 無法 deep 問題 */
export function computedWatch<T, S>(
  source: WatchSource<T>,
  initialState: S,
  cb: ComputedWatchCallback<T, T | undefined, S, Parameters<WatchCallback>[2]>,
) {
  const data = ref<S>(cloneDeep(initialState))

  watch(source, (value, oldValue, onCleanup) => {
    data.value = cb(cloneDeep(value), cloneDeep(oldValue), onCleanup) as UnwrapRef<S>
  }, { deep: true, immediate: true })

  return data
}
