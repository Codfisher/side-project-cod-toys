<template>
  <div
    class="flex items-center gap-2 duration-300"
    :class="{ 'bg-primary/30': selected }"
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
import { computed, onUnmounted, useId } from 'vue'
import { useFeatureStore } from '../stores/feature.store'

interface Props {
  icon?: string;
  text?: string;
  action?: () => void;
}
const props = withDefaults(defineProps<Props>(), {
  action: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>()

defineSlots<{
  default?: () => unknown;
}>()

const featureStore = useFeatureStore()

const id = useId()

featureStore.addOptionId(id)
onUnmounted(() => {
  featureStore.removeOptionId(id)
})

const selected = computed(() => featureStore.selectedOptionId === id)

featureStore.onEnter(() => {
  if (!selected.value) {
    return
  }

  props.action?.()
})
</script>

<style scoped lang="sass">
</style>
