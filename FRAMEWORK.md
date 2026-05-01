# MFE Forge Framework Overview

## What is MFE Forge?

MFE Forge is a **production-ready Micro Frontend framework** that transforms the complex task of building MFE architectures into a streamlined, repeatable process. It is **completely generic** — not tied to any specific company, product, or domain.

## Philosophy

1. **Convention over Configuration** — Sensible defaults that work out of the box
2. **Scope-Based Organization** — Natural grouping by team/product/domain
3. **Zero-Config Development** — Auto-discovery, auto-registration, auto-sync
4. **Framework Agnostic** — While React-focused, designed for extensibility
5. **Production-First** — Error boundaries, testing, CI/CD, Docker from day one

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MFE FORGE CLI                         │
│  init │ generate │ dev │ build │ test │ sync │ doctor     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Templates   │    │  Runtime SDK  │    │   Tooling     │
│               │    │               │    │               │
│ • App         │    │ • Core        │    │ • Type Sync   │
│ • Host        │    │ • Router      │    │ • Port Mgmt   │
│ • Package     │    │ • Store       │    │ • Discovery   │
│ • Design Sys  │    │ • Design      │    │ • CI/CD Gen   │
│ • Library     │    │ • Testing     │    │ • Docker Gen  │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Package Ecosystem

### `mfe-forge` (CLI)
The command-line interface that developers interact with. Published to npm as `mfe-forge`.

**Commands:**
- `init` — Scaffold new projects
- `generate` — Create apps, hosts, packages
- `dev` — Orchestrate dev servers
- `build` — Production builds
- `test` — Run tests
- `sync` — Sync configs across MFEs
- `doctor` — Diagnose issues
- `config` — Manage configuration

### `@mfe-forge/core`
Runtime utilities for resilient MFE applications.

**Features:**
- `MFErrorBoundary` — Graceful error handling with retry
- `EventBus` — Cross-MFE communication without coupling
- `RemoteLoader` — Lazy-loaded remote components with fallback
- `LazyRemote` — Higher-order component for remote loading

### `@mfe-forge/router`
Routing coordination for multi-MFE navigation.

**Features:**
- `useMFENavigation` — Cross-scope navigation hook
- `useRouteSync` — Sync route changes with event bus
- `generateRoutes` — Dynamic route generation from registry
- `createRouteGuard` — Auth/permission-based route guards

### `@mfe-forge/store`
Shared state management across MFEs.

**Features:**
- `useGlobalStore` — Singleton global state (user, theme, locale)
- `createScopedStore` — MFE-specific state factories
- `syncStoreAcrossMFEs` — Bidirectional state synchronization

### `@mfe-forge/design`
Design system foundation.

**Features:**
- `tokens` — Type-safe design tokens (colors, spacing, typography)
- `applyTokens` — Runtime CSS variable application
- Extensible token system for custom themes

### `@mfe-forge/testing`
Testing utilities for MFE architectures.

**Features:**
- `renderMFE` — Render with common providers
- `mockRemoteModule` — Mock federated modules in tests
- `waitForRemoteLoad` — Async remote loading in tests
- `e2eHelpers` — Playwright helpers for cross-MFE testing

## Templates

### App Template
- Vite + React + TypeScript
- Tailwind CSS with design tokens
- Module Federation remote config
- Error boundary wrapper
- React Router setup
- Vitest + Playwright ready

### Host Template
- Shell application with navigation layout
- Auto-discovering remotes configuration
- TypeScript declarations for remotes
- Suspense + lazy loading setup
- Global state provider

### Package Template
- TypeScript library setup
- Workspace dependency resolution
- Entry point scaffolding

### Design System Template
- Storybook configuration
- Token system integration
- Component scaffolding (Button, Card, Input)
- `cn()` utility for Tailwind class merging

### Library Template
- Generic TypeScript library
- tsup build configuration
- Export scaffolding

## Scope-Based Architecture

```
apps/
├── team-a/              # Scope: team-a
│   ├── host/            # Host for team-a MFEs
│   ├── dashboard/       # Dashboard MFE
│   └── reports/         # Reports MFE
├── team-b/              # Scope: team-b
│   ├── host/            # Host for team-b MFEs
│   ├── admin/           # Admin MFE
│   └── settings/        # Settings MFE
└── shared/              # Cross-team scope
    ├── host/            # Shared host
    └── common/          # Common components
```

**Rules:**
1. Each scope has exactly one host
2. Hosts only discover remotes in their scope
3. Cross-scope communication via event bus
4. Shared packages live in `packages/`

## Development Workflow

```bash
# 1. Initialize
mfe-forge init my-project

# 2. Add scope host
mfe-forge generate host platform/host

# 3. Add MFEs
mfe-forge generate app platform/auth
mfe-forge generate app platform/dashboard

# 4. Install
bun install

# 5. Develop (all MFEs)
bun dev

# 6. Sync after changes
mfe-forge sync

# 7. Build for production
mfe-forge build

# 8. Test
mfe-forge test
```

## Configuration

All configuration lives in `mfeforge.config.ts`:

```ts
export default {
  name: 'my-project',
  organization: 'acme',
  defaults: {
    framework: 'react',
    styling: 'tailwind',
    packageManager: 'bun'
  },
  federation: {
    shared: ['react', 'react-dom', 'react-router-dom']
  },
  dev: {
    portRange: [3000, 3999],
    autoStartHost: true
  },
  testing: {
    unit: 'vitest',
    e2e: 'playwright'
  },
  ci: {
    provider: 'github',
    docker: true
  }
}
```

## Publishing

### To npm

```bash
# Build all packages
bun run build

# Add changeset
bun changeset

# Version
bun version-packages

# Publish
bun release
```

### For Your MFE Applications

```bash
# Docker
mfe-forge generate docker --scope platform
docker-compose build
docker-compose push

# Static hosting
mfe-forge build
# Deploy each dist/ folder independently
```

## Why MFE Forge?

| Without MFE Forge | With MFE Forge |
|-------------------|----------------|
| Manual port management | Auto-detected ports |
| Hand-edited vite configs | Auto-registered remotes |
| No type safety across MFEs | Auto-synced declarations |
| Complex dev orchestration | Single `bun dev` command |
| Inconsistent tooling | Standardized templates |
| No error boundaries | Built-in resilience |
| Ad-hoc communication | Event bus pattern |
| Manual CI/CD setup | Generated workflows |

## Roadmap

- [ ] Vue and Svelte support
- [ ] Module Federation 2.0 integration
- [ ] Visual dependency graph
- [ ] Hot reload for remote modules
- [ ] Performance monitoring dashboard
- [ ] Multi-tenant deployment support
