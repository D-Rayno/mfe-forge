# Quick Start

Get a complete Micro Frontend architecture running in under 5 minutes.

## 1. Create a Project

```bash
mfe-forge init my-platform
cd my-platform
```

## 2. Generate a Scope

Scopes organize your MFEs by team or product:

```bash
mfe-forge generate host platform/host
```

## 3. Add Micro Frontends

```bash
mfe-forge generate app platform/auth
mfe-forge generate app platform/dashboard
mfe-forge generate app platform/settings
```

## 4. Install Dependencies

```bash
bun install
```

## 5. Start Development

```bash
bun dev
```

This starts all MFEs in parallel:
- Host on `http://localhost:3000`
- Auth on `http://localhost:3001`
- Dashboard on `http://localhost:3002`
- Settings on `http://localhost:3003`

## 6. Add Routes to Host

Open `apps/platform/host/src/App.tsx`:

```tsx
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const AuthApp = React.lazy(() => import('authApp/App'))
const DashboardApp = React.lazy(() => import('dashboardApp/App'))
const SettingsApp = React.lazy(() => import('settingsApp/App'))

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/auth/*" element={<AuthApp />} />
        <Route path="/dashboard/*" element={<DashboardApp />} />
        <Route path="/settings/*" element={<SettingsApp />} />
      </Routes>
    </Suspense>
  )
}
```

## 7. Cross-MFE Communication

Use the event bus to communicate between MFEs:

```tsx
// In auth app
import { globalEventBus } from '@mfe-forge/core'

function handleLogin(user) {
  globalEventBus.emit('auth:login', { user })
}

// In dashboard app
import { globalEventBus } from '@mfe-forge/core'
import { useEffect } from 'react'

useEffect(() => {
  return globalEventBus.on('auth:login', ({ user }) => {
    console.log('User logged in:', user.name)
  })
}, [])
```

## Next Steps

- [Configure CI/CD](publishing.md)
- [Set up testing](testing.md)
- [Learn about design systems](design-system.md)
