import type {
  DialogChainObject,
  QDialogProps,
} from 'quasar'
import type { Component } from 'vue'
import type { ExtractComponentParams, ExtractComponentSlots } from '../types'
import {
  Dialog,
  QDialog,
} from 'quasar'
import { h } from 'vue'
import BaseDialog from '../components/base-dialog.vue'

/** 可以將 Quasar Dialog Plugin 包裝為 Promise
 *
 * onCancel、onDismiss 事件則分別回傳 `reject('cancel')`、`reject('dismiss')`，
 *
 * 如果使用 BaseDialog，預設回傳 'y'|'n'，若調整 Action 內容，記得泛型調整回傳結果
 *
 * @example
 * ```typescript
 * dialogPromisify(
 *   $q.dialog({
 *     component: BaseDialog,
 *     componentProps,
 *   })
 * ).then((result: 'y' | 'n') => {
 *
 * }).catch((event: 'cancel' | 'dismiss') => {
 *
 * });
 * ```
 *
 * @example
 * ```typescript
 * // 簡化 openUsingDialog 用法，預設回傳 'y'|'n'
 * const answer = await dialogPromisify(
 *  openBaseDialog({
 *    title: '確認儲存結果',
 *    message: '儲存後問卷結果狀態將變更為已完成，使用者將可以看到問卷結果',
 *  })
 * )
 * ```
 */
export function dialogPromisify<Result = 'y' | 'n'>(dialog: DialogChainObject) {
  return new Promise<Result>((resolve, reject) => {
    dialog
      .onOk(resolve)
      .onCancel(() => reject(new Error('cancel')))
      .onDismiss(() => reject(new Error('dismiss')))
  })
}

/** 將 Vue SFC 元件包装為 QDialog，可以更簡單配合 $q.dialog 使用
 *
 * @param component Vue SFC 元件
 * @param param SFC 內所有參數，包含 class、style、event 等等
 * @param dialogProps QDialog 原本參數
 *
 * @example
 * ```typescript
 * const component = wrapWithDialog(BrandEditStatusForm, {
 *   data,
 *   onSuccess() {
 *     dialog.hide();
 *     handleEditSuccess();
 *   },
 * });
 *
 * const dialog = $q.dialog({ component });
 * ```
 *
 * @example
 * ```typescript
 * $q.dialog({
 *   component: wrapWithDialog(
 *     BrandLog,
 *     {
 *       data,
 *       class: 'w-full'
 *     },
 *     {
 *       fullHeight: true,
 *     }
 *   ),
 * });
 * ```
 */
export function wrapWithDialog<Comp extends Component>(
  component: Comp,
  param?: ExtractComponentParams<Comp>,
  slot?: ExtractComponentSlots<Comp>,
  dialogProps?: QDialogProps,
) {
  return h(QDialog, dialogProps, {
    default: () => h(component, param ?? {}, slot ?? {}),
  })
}

/** 使用 Quasar Dialog 開啟元件
 *
 * @param component Vue SFC 元件
 * @param param SFC 內所有參數，包含 class、style、event 等等
 * @param slot SFC 插槽
 * @param dialogProps QDialog 原本參數
 * @returns
 *
 * @example
 * ```typescript
 * const dialog = openUsingDialog(BrandEditStatusForm, {
 *   data,
 *   onSuccess() {
 *     dialog.hide();
 *     handleEditSuccess();
 *   },
 * });
 * ```
 */
export function openUsingDialog<T extends Component>(
  component: T,
  param?: ExtractComponentParams<T>,
  slot?: ExtractComponentSlots<T>,
  dialogProps?: QDialogProps,
) {
  return Dialog.create({
    component: wrapWithDialog(
      component,
      param,
      slot,
      dialogProps,
    ),
  })
}

/**
 * 更簡單配合 Quasar $q.dialog 使用 BaseDialog
 *
 * @example
 * ```typescript
 * // 原本要這樣寫
 * const componentProps: DialogProps = {
 *   message: `確定刪除「${brand.name}」項目嗎？`,
 * }
 *
 * $q.dialog({
 *   component: BaseDialog,
 *   componentProps,
 * }))
 *
 * // 不用引入 BaseDialog 與 $q，可以簡化成
 * openBaseDialog({
 *   message: '確定刪除「${brand.name}」項目嗎？',
 * })
 * ```
 */
export function openBaseDialog(
  param: ExtractComponentParams<typeof BaseDialog>,
) {
  return Dialog.create({
    component: h(BaseDialog, param as any),
  })
}
