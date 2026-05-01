import type { EventBusConfig, EventHandler } from './types.js';

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();
  private config: EventBusConfig;

  constructor(config: EventBusConfig = {}) {
    this.config = { debug: false, prefix: 'mfe:', ...config };
  }

  private getEventName(event: string): string {
    return event.startsWith(this.config.prefix!) ? event : `${this.config.prefix}${event}`;
  }

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    const eventName = this.getEventName(event);

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }

    this.handlers.get(eventName)!.add(handler);

    if (this.config.debug) {
      console.log(`[EventBus] Subscribed to "${eventName}"`);
    }

    return () => this.off(eventName, handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>): void {
    const eventName = this.getEventName(event);
    this.handlers.get(eventName)?.delete(handler);
  }

  emit<T = any>(event: string, payload?: T): void {
    const eventName = this.getEventName(event);
    const handlers = this.handlers.get(eventName);

    if (this.config.debug) {
      console.log(`[EventBus] Emitting "${eventName}"`, payload);
    }

    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[EventBus] Error in handler for "${eventName}":`, error);
        }
      });
    }
  }

  once<T = any>(event: string, handler: EventHandler<T>): () => void {
    const unsubscribe = this.on<T>(event, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }

  clear(event?: string): void {
    if (event) {
      this.handlers.delete(this.getEventName(event));
    } else {
      this.handlers.clear();
    }
  }
}

// Singleton instance for cross-MFE communication
export const globalEventBus = new EventBus({ prefix: 'mfe:global:' });

export function createEventBus(config?: EventBusConfig): EventBus {
  return new EventBus(config);
}
