import type zhTW from './langs/zh-TW.json'
import messages from '@intlify/unplugin-vue-i18n/messages'

import { createI18n } from 'vue-i18n'

export type MessageSchema = typeof zhTW
export enum LangCode {
  ZH_TW = 'zh-TW',
  EN_US = 'en-US',
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en-US',
  messages,
})

export default i18n
