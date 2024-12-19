import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TheHome from './the-home.vue'

describe('the-home 元件', () => {
  describe('測試基本內容', () => {
    it('是否包含 codfish 文字', () => {
      const wrapper = mount(TheHome, {
        global: {
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
            }),
          ],
        },
      });

      expect(wrapper.text()).toContain('codfish');
    })
  })
})