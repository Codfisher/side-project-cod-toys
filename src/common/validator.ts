/** 各類表單驗證 function FP 版本 */

import type { ValidationRule } from 'quasar'
import { isNil } from 'lodash-es'

// TODO: 追加從 Zod Schema 轉換為 Quasar field rule 的函式

/** 建立符合 Quasar field rule 參數
 *
 * @example
 * ```typescript
 * // 單一規則
 * const notEmptyRule = createRule([notEmpty], '不可為空');
 *
 * // 加入 isOptional 變成選填
 * const mailRule = createRule([isOptional, isEmail], '必須為 E-mail');
 *
 * // 展開成矩陣可以組成複合規則
 * const nameRule = [
 *  ...createRule([notEmpty], '不可為空'),
 *  ...createRule([(value: string) => value.length <= 20], '最多 20 個字元'),
 * ];
 *
 * // 也可以在每個規則獨立定義錯誤訊息
 * const rule = createRule([
 *   (value: string) => value.length <= 20 || '最多 20 個字',
 * ], '資料錯誤')
 * ```
 */
export function createRule(
  rules: ((value: unknown) => boolean | string)[],
  message?: string,
) {
  return [
    (data: unknown) => {
      try {
        for (const rule of rules) {
          const result = rule(data)
          if (typeof result === 'string') {
            return result
          }

          if (result === true) {
            return true
          }
        }
      }
      catch (error) {
        return `${error}`
      }

      return message || true
    },
  ] as ValidationRule[]
}

/** 數值是否大於零之正整數 */
export function isPositiveNumberGreaterThan0(value: any) {
  return /^0*[1-9]\d*$/.test(`${value}`)
}

/** 數值是否正整數 */
export function isPositiveNumber(value: any) {
  return /^\d+$/.test(`${value}`)
}

/**
 * 數值是否為 `null`、`undefined`、`''`、`[]`
 */
export function isOptional(value: any) {
  if (Array.isArray(value)) {
    return value.length === 0
  }

  return isNil(value) || value === ''
}
/** isOptional 的反轉 */
export function notEmpty(value: any) {
  return !isOptional(value)
}

/** 僅限 YYYY-MM-DD 格式 */
export function isDate(value: any) {
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/
  if (!regex.test(value)) {
    return false
  }

  const [, year, month, day] = (regex.exec(value) as RegExpExecArray).map(Number)
  const date = new Date(year!, month! - 1, day)

  if (date.getFullYear() !== year
    || date.getMonth() + 1 !== month
    || date.getDate() !== day) {
    return false
  }

  return true
}
