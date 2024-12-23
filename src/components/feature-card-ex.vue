<template>
  <div
    v-if="visible"
    class="border p-4"
  >
    輸入任意文字後隱藏
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  inputText?: string;
}
const props = withDefaults(defineProps<Props>(), {
  inputText: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>()

const visible = computed(() => !props.inputText)
</script>

<style scoped lang="sass">
</style>
