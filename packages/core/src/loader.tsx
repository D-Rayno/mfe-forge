import React, { lazy, Suspense, type ReactNode } from 'react';
import { MFErrorBoundary } from './error-boundary.js';
import type { RemoteComponentProps } from './types.js';

export function RemoteLoader({ remoteName, moduleName = 'App', fallback, props = {} }: RemoteComponentProps) {
  const LazyComponent = lazy(() => import(/* @vite-ignore */ `${remoteName}/${moduleName}`));

  return (
    <MFErrorBoundary remoteName={remoteName} fallback={
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Failed to load {remoteName}</p>
      </div>
    }>
      <Suspense fallback={fallback || <DefaultFallback remoteName={remoteName} />}>
        <LazyComponent {...props} />
      </Suspense>
    </MFErrorBoundary>
  );
}

export function LazyRemote(
  factory: () => Promise<{ default: React.ComponentType<any> }>,
  options?: { fallback?: ReactNode; remoteName?: string }
) {
  const Component = lazy(factory);

  return function LazyRemoteWrapper(props: any) {
    return (
      <MFErrorBoundary remoteName={options?.remoteName}>
        <Suspense fallback={options?.fallback || <DefaultFallback remoteName={options?.remoteName} />}>
          <Component {...props} />
        </Suspense>
      </MFErrorBoundary>
    );
  };
}

function DefaultFallback({ remoteName }: { remoteName?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#6b7280'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Loading {remoteName || 'component'}...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
