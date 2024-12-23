<template>
  <div
    ref="pageRef"
    class="flex-col"
  >
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

    <div class="flex-col">
      <feature-card-ex />
      <feature-card-kaomoji />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import FeatureCardEx from '../components/feature-card-ex.vue'
import FeatureCardKaomoji from '../components/feature-card-kaomoji.vue'
import { useMain } from '../composables/use-main'

const mainApi = useMain()

const inputValue = ref('')

const pageRef = ref<HTMLDivElement>()
const { height } = useElementBounding(pageRef)

watchEffect(() => {
  mainApi.updateHeight(height.value)
})
</script>

<style scoped lang="sass">
</style>
