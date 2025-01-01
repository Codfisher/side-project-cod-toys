<template>
  <div
    ref="optionRef"
    class="flex items-center gap-2 duration-300"
    :class="{ 'bg-primary/30': selected }"
    @click="props.action()"
  >
    <q-icon
      v-if="props.icon"
      :name="props.icon"
      size="1.5rem"
    />
    <slot>
      {{ props.text }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, onUnmounted, ref, useId, watch } from 'vue'
import { useFeatureStore } from '../stores/feature.store'

interface Props {
  icon?: string;
  text?: string;
  action?: () => void;
}
const props = withDefaults(defineProps<Props>(), {
  action: () => () => { },
})

defineSlots<{
  default?: () => unknown;
}>()

const featureStore = useFeatureStore()

const id = useId()
const optionRef = ref<HTMLDivElement>()
const { y } = useElementBounding(optionRef)

watch(() => [props, y.value], () => {
  featureStore.addOption(id, {
    y: y.value,
    action: props.action,
  })
}, { deep: true })
onUnmounted(() => {
  featureStore.removeOption(id)
})

const selected = computed(() => featureStore.selectedOptionId === id)
</script>

<style scoped lang="sass">
</style>
