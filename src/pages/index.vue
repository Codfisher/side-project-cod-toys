<template>
  <div class="flex-col">
    <q-input
      v-model="inputValue"
      placeholder="要來點甚麼？...(´,,•ω•,,)"
      autofocus
      outlined
      square
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
</script>

<style scoped lang="sass">
</style>
