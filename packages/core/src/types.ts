import type { ReactNode } from 'react';

export interface MFEErrorInfo {
  componentStack: string;
  error: Error;
  remoteName?: string;
}

export interface RemoteComponentProps {
  remoteName: string;
  moduleName?: string;
  fallback?: ReactNode;
  props?: Record<string, any>;
}

export interface EventBusConfig {
  debug?: boolean;
  prefix?: string;
}

export type EventHandler<T = any> = (payload: T) => void;
