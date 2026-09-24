import { describe, expect, it, vi } from 'vitest'
import { EventBus } from './event-bus.js'

describe('EventBus', () => {
  it('adds the configured prefix and dispatches payloads', () => {
    const bus = new EventBus({ prefix: 'test:' })
    const handler = vi.fn()

    bus.on('updated', handler)
    bus.emit('updated', { id: 42 })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ id: 42 })
  })

  it('unsubscribes a handler', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    const unsubscribe = bus.on('event', handler)
    unsubscribe()
    bus.emit('event', 'payload')

    expect(handler).not.toHaveBeenCalled()
  })

  it('supports once listeners', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.once('event', handler)
    bus.emit('event', 1)
    bus.emit('event', 2)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('clears one event or all events', () => {
    const bus = new EventBus()
    const first = vi.fn()
    const second = vi.fn()

    bus.on('first', first)
    bus.on('second', second)
    bus.clear('first')
    bus.emit('first')
    bus.emit('second')

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)

    bus.clear()
    bus.emit('second')
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('contains handler errors and continues dispatching', () => {
    const bus = new EventBus()
    const first = vi.fn(() => {
      throw new Error('boom')
    })
    const second = vi.fn()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    bus.on('event', first)
    bus.on('event', second)
    bus.emit('event', 'payload')

    expect(second).toHaveBeenCalledWith('payload')
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
