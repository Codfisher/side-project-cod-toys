<template>
  <q-list
    class="py-5"
  >
    <template
      v-for="group in list"
      :key="group.label"
    >
      <q-expansion-item
        :label="group.label"
        :to="group.to"
        group="list"
        popup
      >
        <div class="flex-col pb-3">
          <template
            v-for="item, i in group.items"
            :key="item.label"
          >
            <div
              v-if="group.items[i - 1]?.group !== item.group"
              class="bg-gray-100 px-4 py-2 text-base opacity-50"
            >
              {{ item.group }}
            </div>

            <q-item
              v-ripple
              clickable
              :to="item.to"
              dense
              class="px-4 py-2"
            >
              <q-item-section side>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section>
                {{ item.label }}
              </q-item-section>
            </q-item>
          </template>
        </div>
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useQuasar } from 'quasar'
import { filter, groupBy, isTruthy, map, pipe, values } from 'remeda'
import { computed } from 'vue'
import { routes } from 'vue-router/auto-routes'
import { z } from 'zod'

interface MenuItem {
  label: string;
  to: { name: string };
  items: Array<{
    label: string;
    to: { name: string };
    group?: string;
    icon?: string;
  }>;
}

const $q = useQuasar()

const metaSchema = z.object({
  label: z.string(),
  /** 用於第二層分組 */
  group: z.string().optional(),
  icon: z.string().optional(),
})

/** 鋪平 routes 任意深度 children */
function flattenRoutes(routes: RouteRecordRaw[]) {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    if (route.children) {
      result.push(...flattenRoutes(route.children))
    }
    else {
      result.push(route)
    }
  })

  return result
}

/** 目前預期兩層，第一層是分類首頁，第二層是按鈕 */
const list = computed<MenuItem[]>(() => {
  const result = pipe(
    routes,
    flattenRoutes,
    // 使用 name 第一層 path 分組
    groupBy((route) => {
      const pathList = (route.name?.toString() ?? '')
        .split('/')
        .filter(Boolean)

      // '' 是為了保留最外層 name = '' 的路由
      return pathList[0] ?? ''
    }),
    values(),
    // 取出第一層的 route 與所有 items
    map((routes) => {
      // name 長度為 1 者為第一層
      const root = routes.find(({ name }) => {
        return (name?.toString() ?? '')
          .split('/')
          .filter(Boolean)
      })
      if (!root) {
        throw new Error('root not found')
      }
      // label 不存在不顯示
      if (!root.meta?.label)
        return

      return {
        label: root.meta?.label as string ?? '',
        to: { name: root.name?.toString() ?? '' },
        items: routes
          // label 不存在不顯示
          .filter((data) => {
            return data !== root && data.meta?.label
          })
          .map((route) => {
            const result = metaSchema.safeParse(route.meta)
            if (!result.success) {
              $q.notify({
                type: 'negative',
                message: `路由 ${route.name?.toString()} meta 錯誤`,
              })
              throw new Error(JSON.stringify(result.error, null, 2))
            }

            return {
              label: result.data.label,
              to: { name: route.name?.toString() ?? '' },
              group: result.data.group,
              icon: result.data.icon,
            }
          }),
      }
    }),
    filter(isTruthy),
  )

  return result
})
</script>

<style scoped lang="sass">
</style>
