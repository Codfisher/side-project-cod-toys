import { createTestingPinia } from '@pinia/testing'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { mount } from '@vue/test-utils'
import Quasar from 'quasar'

import { describe, expect, it, vi } from 'vitest'
import App from './App.vue'
// import i18n from './locales/i18n'

installQuasarPlugin()

describe('app 入口組件', () => {
  describe('測試基本內容', () => {
    it('是否包含「管理系統」文字', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
            }),
            Quasar,
            // i18n,
          ],
        },
      })

      expect(wrapper.text()).toContain('管理系統')
    })
  })
})
