<template>
  <q-breadcrumbs class="opacity-50">
    <q-breadcrumbs-el
      v-for="item in paths"
      :key="item.to"
      v-bind="item"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import type { QBreadcrumbsProps } from 'quasar'
import { map, pipe, prop, uniqueBy } from 'remeda'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props extends QBreadcrumbsProps { }
defineProps<Props>()

const route = useRoute()
const router = useRouter()

const routes = router.getRoutes()

const paths = computed(() => pipe(
  route.matched,
  // /index.vue 的 meta 不知道為甚麼遺失了，從 routes 取回來
  map((item) => {
    const target = routes.find((route) => route.path === item.path)
    return target ?? item
  }),
  uniqueBy(prop('path')),
  map((item) => ({
    label: item.meta.label as string ?? '',
    icon: item.meta.icon as string ?? undefined,
    to: item.path,
  })),
),
)
</script>

<style scoped lang="sass">
</style>
