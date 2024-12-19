import { beforeEach, describe, expect, it } from 'vitest';
import { setActivePinia, createPinia } from 'pinia'
import { useMainStore } from './main.store';

describe('main Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('資料是否存在', () => {
    const store = useMainStore();
    expect(store.data).toBe('codfish');
  })
})