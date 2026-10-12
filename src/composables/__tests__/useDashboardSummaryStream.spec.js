import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { useDashboardSummaryStream } from '../useDashboardSummaryStream'

// jsdom no implementa EventSource (SSE): se simula una versión mínima que
// solo guarda la URL/opciones recibidas y permite disparar el evento
// "summary-changed" a mano desde el test
class FakeEventSource {
  constructor(url, options) {
    this.url = url
    this.options = options
    this.listeners = {}
    this.closed = false
    FakeEventSource.instances.push(this)
  }

  addEventListener(event, handler) {
    this.listeners[event] = handler
  }

  close() {
    this.closed = true
  }
}
FakeEventSource.instances = []

function mountWithComposable(onChange) {
  const TestComponent = defineComponent({
    setup() {
      useDashboardSummaryStream(onChange)
      return () => h('div')
    },
  })

  return mount(TestComponent)
}

describe('useDashboardSummaryStream', () => {
  let originalEventSource

  beforeEach(() => {
    originalEventSource = globalThis.EventSource
    FakeEventSource.instances = []
    globalThis.EventSource = FakeEventSource
  })

  afterEach(() => {
    globalThis.EventSource = originalEventSource
  })

  it('opens an EventSource connection to the summary stream endpoint, with credentials', () => {
    mountWithComposable(() => {})

    const [eventSource] = FakeEventSource.instances
    expect(eventSource.url).toBe(`${import.meta.env.VITE_API_URL}/admin/dashboard/summary/stream`)
    expect(eventSource.options).toEqual({ withCredentials: true })
  })

  it('calls onChange whenever the server sends a "summary-changed" event', () => {
    const onChange = vi.fn()
    mountWithComposable(onChange)

    const [eventSource] = FakeEventSource.instances
    eventSource.listeners['summary-changed']()

    expect(onChange).toHaveBeenCalled()
  })

  it('closes the connection when the component unmounts', () => {
    const wrapper = mountWithComposable(() => {})
    const [eventSource] = FakeEventSource.instances

    wrapper.unmount()

    expect(eventSource.closed).toBe(true)
  })
})
