import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  // Antes de cada test, se crea una instancia nueva de Pinia
  // para que los stores no compartan estado entre tests
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with count at 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increments the count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('computes double count correctly', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    expect(store.doubleCount).toBe(4)
  })
})
