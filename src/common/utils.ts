import type { Component } from 'vue'
import type { ExtractComponentParams, ExtractComponentSlots } from '../types'
import { get, isEqual } from 'lodash-es'
import { pipe } from 'remeda'
import { h } from 'vue'

/** 比較兩物件是否在所有指定路徑接相等 */
export function isEqualObject(value: any, other: any, paths: string[]): boolean {
  const anyNot = paths.some((path) =>
    !isEqual(get(value, path), get(other, path)),
  )

  return !anyNot
}

/** 元件繼承參數
 *
 * [文件](https://cn.vuejs.org/guide/components/attrs.html#fallthrough-attributes)
 */
export interface InheritAttr {
  class?: string;
  onClick?: (event: MouseEvent) => void;
}

/** Veu h function 有型別推導的版本
 *
 * [何謂 h function](https://cn.vuejs.org/guide/extras/render-function.html)
 *
 * @param component Vue SFC 元件或 element 名稱
 * @param prop SFC 內所有參數，包含 class、style、event 等等
 * @param slot SFC 插槽
 * @returns
 *
 */
export function typedH(
  component: string,
  prop?: string,
): ReturnType<typeof h>
export function typedH<Comp extends Component>(
  component: Comp,
  param?: ExtractComponentParams<Comp> & InheritAttr,
  slot?: ExtractComponentSlots<Comp>,
): ReturnType<typeof h>
export function typedH(
  component: any,
  param?: any,
  slot?: any,
) {
  if (!slot) {
    return h(component, param)
  }
  return h(component, param, slot)
}

export function toPriceFormat(value: number | string, locales?: string) {
  return pipe(
    value,
    (data) => {
      if (typeof data === 'string') {
        return Number.parseFloat(data)
      }
      return data
    },
    (data) => data.toLocaleString(locales),
  )
}
