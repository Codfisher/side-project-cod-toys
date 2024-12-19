<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="mainStore.toggleDrawerVisible()"
          />

          <span class="text-xl font-medium">
            管理系統
          </span>
        </q-toolbar-title>

        <!-- <q-icon
          name="logout"
          size="1.5rem"
          class="mr-1 cursor-pointer"
          @click="logout"
        /> -->

        <q-icon
          name="person"
          size="1.5rem"
          class="mr-1"
        />
        <!-- {{ user?.name }} -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerVisible"
      side="left"
      bordered
    >
      <menu-nav />
    </q-drawer>

    <q-page-container>
      <q-page class="flex-col">
        <router-view />
      </q-page>
    </q-page-container>

    <!-- 登入 -->
    <!-- <q-dialog
      v-if="!isUserLoading"
      :model-value="!user"
      persistent
    >
      <login-form />
    </q-dialog> -->
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { watchEffect } from 'vue'
import { version } from '../package.json'
import MenuNav from './components/menu-nav.vue'
import { useMainStore } from './stores/main.store'
import { useUserStore } from './stores/user.store'

const userStore = useUserStore()
const { isLoading: isUserLoading, user } = storeToRefs(userStore)

const mainStore = useMainStore()
const { drawerVisible } = storeToRefs(mainStore)

const $q = useQuasar()
/** 自動映射 icon，加上 sym_r 前綴。https://quasar.dev/vue-components/icon#custom-mapping */
$q.iconMapFn = (iconName) => ({
  icon: iconName.includes('sym_r') ? iconName : `sym_r_${iconName}`,
})

watchEffect(() => {
  document.title = `管理系統 v${version}`
})
</script>

<style lang="sass">
html, body, #app
  width: 100%
  height: 100%
  padding: 0
  margin: 0

#app
  display: flex
  flex-direction: column
</style>
