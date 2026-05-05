import type { ReactNode } from 'react'

/** Information about an error caught by the MFE error boundary. */
export interface MFEErrorInfo {
  /** The component stack trace from React's error boundary */
  componentStack: string
  /** The original error object */
  error: Error
  /** Name of the remote MFE that threw the error (if applicable) */
  remoteName?: string
}

/** Props for the RemoteLoader component. */
export interface RemoteComponentProps {
  /** Name of the remote federated module (e.g., 'checkoutApp') */
  remoteName: string
  /** Module export name to load (defaults to 'App') */
  moduleName?: string
  /** Custom loading fallback UI */
  fallback?: ReactNode
  /** Props to pass down to the loaded remote component */
  props?: Record<string, any>
}

/** Configuration options for the EventBus. */
export interface EventBusConfig {
  /** Enable console logging for subscriptions and emissions */
  debug?: boolean
  /** Prefix prepended to all event names (default: 'mfe:') */
  prefix?: string
}

/** Callback type for event bus subscriptions. */
export type EventHandler<T = any> = (payload: T) => void
