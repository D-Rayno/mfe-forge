import type { EventBusConfig, EventHandler } from './types.js'

/**
 * A lightweight, type-safe event bus for cross-MFE communication.
 * Events are namespaced with a configurable prefix to avoid collisions
 * between different micro frontends.
 *
 * @example
 * ```ts
 * const bus = new EventBus({ debug: true, prefix: 'myapp:' })
 * const unsub = bus.on('cart:updated', (items) => console.log(items))
 * bus.emit('cart:updated', [{ id: 1, qty: 2 }])
 * unsub() // unsubscribe
 * ```
 */
export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>()
  private config: EventBusConfig

  constructor(config: EventBusConfig = {}) {
    this.config = { debug: false, prefix: 'mfe:', ...config }
  }

  /** Prepends the configured prefix to event names if not already present. */
  private getEventName(event: string): string {
    return event.startsWith(this.config.prefix!) ? event : `${this.config.prefix}${event}`
  }

  /**
   * Subscribes to an event. Returns an unsubscribe function.
   *
   * @param event - Event name (prefix is auto-applied)
   * @param handler - Callback invoked when the event is emitted
   * @returns Unsubscribe function to remove this listener
   */
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    const eventName = this.getEventName(event)

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set())
    }

    this.handlers.get(eventName)!.add(handler)

    if (this.config.debug) {
      console.log(`[EventBus] Subscribed to "${eventName}"`)
    }

    return () => this.off(eventName, handler)
  }

  /**
   * Removes a specific handler from an event.
   *
   * @param event - Event name
   * @param handler - The exact handler reference to remove
   */
  off<T = any>(event: string, handler: EventHandler<T>): void {
    const eventName = this.getEventName(event)
    this.handlers.get(eventName)?.delete(handler)
  }

  /**
   * Emits an event, invoking all registered handlers with the given payload.
   * Errors in individual handlers are caught and logged without affecting other handlers.
   *
   * @param event - Event name
   * @param payload - Data to pass to all handlers
   */
  emit<T = any>(event: string, payload?: T): void {
    const eventName = this.getEventName(event)
    const handlers = this.handlers.get(eventName)

    if (this.config.debug) {
      console.log(`[EventBus] Emitting "${eventName}"`, payload)
    }

    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`[EventBus] Error in handler for "${eventName}":`, error)
        }
      })
    }
  }

  /**
   * Subscribes to an event for a single emission only.
   * The handler is automatically removed after the first invocation.
   *
   * @param event - Event name
   * @param handler - Callback invoked once
   * @returns Unsubscribe function (can be called to cancel before emission)
   */
  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    const unsubscribe = this.on<T>(event, (payload) => {
      handler(payload)
      unsubscribe()
    })
    return unsubscribe
  }

  /**
   * Clears all handlers for a specific event, or all handlers if no event is specified.
   *
   * @param event - Optional event name to clear; if omitted, clears everything
   */
  clear(event?: string): void {
    if (event) {
      this.handlers.delete(this.getEventName(event))
    } else {
      this.handlers.clear()
    }
  }
}

/**
 * Global singleton event bus for cross-MFE communication.
 * Uses the 'mfe:global:' prefix to distinguish from scoped event buses.
 */
export const globalEventBus = new EventBus({ prefix: 'mfe:global:' })

/**
 * Factory function to create a new scoped EventBus instance.
 *
 * @param config - Optional configuration for the event bus
 * @returns A new EventBus instance
 */
export function createEventBus(config?: EventBusConfig): EventBus {
  return new EventBus(config)
}
