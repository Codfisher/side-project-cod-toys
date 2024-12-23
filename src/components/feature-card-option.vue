<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  label?: string;
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>()

defineSlots<{
  default?: () => unknown;
}>()

const id = useId()

const selected = computed(() => false)
</script>

<style scoped lang="sass">
</style>
