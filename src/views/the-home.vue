<template>
  <div class="flex gap-10">
    我是 Home Page，右邊是響應式圖片
    <q-img :src="imgSrc" />
    {{ store.data }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import imgSrc from '../assets/logo.png';

import { useMainStore } from '../stores/main.store';


const store = useMainStore();
</script>

<style scoped lang="sass">
</style>
