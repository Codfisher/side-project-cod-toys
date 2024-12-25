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
import { useElementHover } from '@vueuse/core'
import { computed, onUnmounted, ref, useId } from 'vue'
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

featureStore.addOption(id, {
  action: props.action,
})
onUnmounted(() => {
  featureStore.removeOption(id)
})

const optionRef = ref<HTMLDivElement>()
const isHover = useElementHover(optionRef)
const selected = computed(
  () => isHover.value || featureStore.selectedOptionId === id,
)
</script>

<style scoped lang="sass">
</style>
