<!-- <template></template> -->

<script setup lang="ts">
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
</script>

<style scoped lang="sass">
</style>
