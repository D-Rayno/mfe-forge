# Architecture Guide

## Core Concepts

### Scopes

Scopes are top-level directories under `apps/` that group related MFEs. They represent teams, products, or business domains.

```
apps/
├── stockly/          # Stockly product team
│   ├── host/         # Shell application
│   ├── auth/         # Authentication MFE
│   └── dashboard/    # Dashboard MFE
└── meridian/         # Meridian product team
    ├── host/
    └── analytics/
```

Each scope has exactly one host that orchestrates its MFEs.

### Host Application

The host is the shell application that:
- Loads remote MFEs via Module Federation
- Provides shared layout and navigation
- Coordinates routing between MFEs
- Manages global state

### Remote Applications

Remotes are independent MFEs that:
- Expose their root component via `remoteEntry.js`
- Run on their own dev server port
- Can be developed and deployed independently

### Shared Packages

Packages in `packages/` contain:
- UI components
- Business logic
- Utilities
- Type definitions

## Module Federation Configuration

MFE Forge uses `@originjs/vite-plugin-federation` with these conventions:

### Remote (App)
```ts
federation({
  name: 'authApp',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/bootstrap.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

### Host
```ts
federation({
  name: 'stocklyHostApp',
  remotes: {
    authApp: 'http://localhost:3001/assets/remoteEntry.js',
    dashboardApp: 'http://localhost:3002/assets/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

## State Management

### Global Store

Use `@mfe-forge/store` for cross-MFE state:

```ts
import { useGlobalStore } from '@mfe-forge/store'

function Component() {
  const user = useGlobalStore(state => state.user)
  const setUser = useGlobalStore(state => state.setUser)
  // ...
}
```

### Scoped Store

For MFE-specific state:

```ts
import { createScopedStore } from '@mfe-forge/store'

const useAuthStore = createScopedStore('auth', {
  token: null,
  permissions: []
})
```

## Communication Patterns

### Event Bus (Recommended)

For loose coupling between MFEs:

```ts
import { globalEventBus } from '@mfe-forge/core'

// Emit
globalEventBus.emit('cart:itemAdded', { productId: '123' })

// Subscribe
const unsubscribe = globalEventBus.on('cart:itemAdded', (item) => {
  console.log(item)
})

// Cleanup
unsubscribe()
```

### Direct Imports

For tightly coupled MFEs (same scope):

```ts
import { Button } from '@stockly/ui'
```

### URL-based Communication

Pass state via URL parameters for shareable links.

## Routing Strategy

### Host-controlled Routing

The host owns the router. MFEs render within route boundaries:

```tsx
// Host
<Routes>
  <Route path="/auth/*" element={<AuthApp />} />
  <Route path="/dashboard/*" element={<DashboardApp />} />
</Routes>
```

### Nested Routing

MFEs can have their own internal routes:

```tsx
// Auth MFE
<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
</Routes>
```

### Cross-MFE Navigation

```ts
import { useMFENavigation } from '@mfe-forge/router'

function Component() {
  const { navigateTo } = useMFENavigation()

  return (
    <button onClick={() => navigateTo('dashboard', '/reports')}>
      Go to Reports
    </button>
  )
}
```

## Error Handling

Always wrap remote MFEs in error boundaries:

```tsx
import { MFErrorBoundary, RemoteLoader } from '@mfe-forge/core'

function App() {
  return (
    <MFErrorBoundary 
      remoteName="dashboard"
      fallback={(error) => <CustomError error={error} />}
    >
      <RemoteLoader remoteName="dashboardApp" />
    </MFErrorBoundary>
  )
}
```

## Performance

### Code Splitting

Each MFE is naturally code-split via Module Federation.

### Lazy Loading

```tsx
const DashboardApp = React.lazy(() => import('dashboardApp/App'))
```

### Prefetching

```tsx
// Prefetch on hover
const prefetchDashboard = () => {
  import('dashboardApp/App')
}

<button onMouseEnter={prefetchDashboard}>
  Dashboard
</button>
```

## Security

### Sandbox Strategy

MFE Forge recommends:
1. Same-origin deployment for same-scope MFEs
2. CSP headers configured in host
3. Input validation in each MFE
4. Auth state in global store with secure HTTP-only cookies

### Isolation Levels

| Level | Use Case |
|-------|----------|
| Shared runtime | Same team, high trust |
| Event bus only | Cross-team, medium trust |
| iframe | Third-party, low trust |
