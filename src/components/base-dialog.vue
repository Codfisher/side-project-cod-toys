<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="w-[400px] flex flex-col justify-between">
      <q-card-section
        v-if="props.title"
        class="px-6 pb-0 pt-5 text-xl font-medium"
        :class="props.titleClass"
      >
        <q-icon
          v-if="props.icon.name"
          :name="props.icon.name"
          :color="props.icon.color"
          :size="props.icon.size"
          square
          class="mr-1"
        />
        {{ props.title }}
      </q-card-section>

      <q-card-section class="flex items-center px-6">
        <span class="whitespace-pre-line text-sm text-[#3D3D3D]">
          {{ props.message }}
        </span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-for="btn in props.actions"
          :key="btn.action"
          :color="btn.color"
          :text-color="getTextColor(btn.textColor, btn.type)"
          :style="getTypeStyle(btn.type)"
          unelevated
          :size="btn.size"
          :padding="btn.padding"
          @click="handleOKClick(btn.action)"
        >
          {{ btn.label }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { cloneDeep, defaultsDeep } from 'lodash-es'
import { useDialogPluginComponent } from 'quasar'
import { pipe } from 'remeda'
import { computed } from 'vue'

export type BtnType = 'negative'

interface Action {
  /** 動作 */
  action: string;
  /** 類型 */
  type?: BtnType;
  /** 內容 */
  label: string;
  /** 背景顏色 */
  color?: string;
  padding?: string;
  /** 文字顏色 */
  textColor?: string;
  size?: string;
}

export interface Props {
  icon?: {
    /**
     * 名稱
     * @default notifications
     */
    name?: string;
    /**
     * 顏色
     * @default warning
     */
    color?: string;
    /** @default 50px */
    size?: string;
  };
  title?: string;
  titleClass?: string;
  /**
   * 訊息
   * @default 確定是否執行此動作？
   */
  message?: string;
  /**
   * 按鈕
   * @default 確定(y)、取消(n)
   */
  actions?: Action[];
}

const _props = defineProps<Props>()

const emit = defineEmits({
  ...useDialogPluginComponent.emitsObject,
})

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent<string>()

const defaultAction = {
  textColor: 'primary',
  size: '16px',
}

const defaultProps: Required<Props> = {
  icon: {
    name: 'error',
    color: 'negative',
    size: '1.5rem',
  },
  title: '',
  titleClass: 'text-negative',
  message: '確定是否執行此動作？',
  actions: [
    {
      action: 'n',
      label: '取消',
      ...defaultAction,
    },
    {
      action: 'y',
      label: '確認',
      ...defaultAction,
    },
  ],
}

const props = computed(() => pipe('', () => defaultsDeep(cloneDeep(_props), defaultProps), (props: Required<Props>) => {
  const actions = _props.actions?.map((action) => defaultsDeep(action, defaultAction))
    ?? defaultProps.actions

  return {
    ...props,
    actions,
  }
}))

const styleMap: Record<BtnType, string> = {
  negative: 'background: #FEE2E2; color: #C10015;',
}

function handleOKClick(action: string) {
  onDialogOK(action)
}

function getTypeStyle(type: BtnType) {
  if (!type) {
    return undefined
  }

  return styleMap[type]
}

function getTextColor(color?: string, type?: BtnType) {
  if (type) {
    return undefined
  }

  return color ?? 'primary'
}
</script>

<style scoped lang="sass">
</style>
