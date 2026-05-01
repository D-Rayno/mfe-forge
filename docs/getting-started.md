# Getting Started with MFE Forge

This guide will walk you through creating a complete Micro Frontend architecture from scratch.

## Prerequisites

- Node.js >= 20.0.0 (or Bun >= 1.1.0)
- Package manager: npm, pnpm, or Bun
- Git

## Step 1: Initialize Your Project

```bash
npx mfe-forge init stockly-platform
```

This creates:
- Workspace configuration
- Base TypeScript config
- `mfeforge.config.ts` with your preferences
- Directory structure (`apps/`, `packages/`)

## Step 2: Create Your First Scope

Scopes organize MFEs by team or product. Let's create a `stockly` scope:

```bash
cd stockly-platform
npx mfe-forge generate host stockly/host
```

This scaffolds a host application at `apps/stockly/host` on port 3000.

## Step 3: Add Micro Frontends

```bash
npx mfe-forge generate app stockly/auth
npx mfe-forge generate app stockly/dashboard
npx mfe-forge generate app stockly/inventory
```

Each app:
- Gets an auto-detected port
- Is registered in the host's `vite.config.ts`
- Gets a dev script in root `package.json`

## Step 4: Add Shared Packages

```bash
npx mfe-forge generate package ui
npx mfe-forge generate package utils
```

## Step 5: Install Dependencies

```bash
bun install
# or
pnpm install
# or
npm install
```

## Step 6: Start Developing

```bash
# Run everything
bun dev

# Or run specific scope
bun mfe-forge dev --scope stockly

# Or run single app
bun mfe-forge dev --app stockly/auth
```

## Step 7: Configure Routes in Host

Open `apps/stockly/host/src/App.tsx` and add routes:

```tsx
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const AuthApp = React.lazy(() => import('authApp/App'))
const DashboardApp = React.lazy(() => import('dashboardApp/App'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/auth/*" element={<AuthApp />} />
        <Route path="/dashboard/*" element={<DashboardApp />} />
      </Routes>
    </Suspense>
  )
}
```

## Step 8: Cross-MFE Communication

Use the event bus for communication:

```tsx
import { globalEventBus } from '@mfe-forge/core'

// In auth app
function login() {
  globalEventBus.emit('auth:login', { user: { id: '1', name: 'John' } })
}

// In dashboard app
useEffect(() => {
  return globalEventBus.on('auth:login', ({ user }) => {
    console.log('User logged in:', user)
  })
}, [])
```

## Step 9: Sync Everything

After adding or removing apps, sync configurations:

```bash
npx mfe-forge sync
```

This updates:
- Host `vite.config.ts` remotes
- TypeScript declarations
- Route registrations

## Next Steps

- [Configure CI/CD](ci-cd.md)
- [Set up testing](testing.md)
- [Learn about design systems](design-system.md)
