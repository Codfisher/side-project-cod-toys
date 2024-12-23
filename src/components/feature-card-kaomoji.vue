<template>
  <div v-if="visible">
    <div
      v-if="!isFeature"
      class="border p-4"
      tabindex="0"
    >
      輸入 @ 搜尋顏文字
    </div>

    <template v-else>
      <div tabindex="0" class="border p-4">
        (´▽`ʃ♡ƪ)
      </div>
      <div tabindex="0" class="border p-4">
        ੭ ˙ᗜ˙ )੭
      </div>
    </template>
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

const visible = computed(() => {
  return !props.inputText || props.inputText.startsWith('@')
})

const isFeature = computed(() => props.inputText.startsWith('@'))
</script>

<style scoped lang="sass">
</style>
