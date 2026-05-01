# CLI Reference

## `mfe-forge init [name]`

Initialize a new MFE Forge project.

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --template <template>` | Project template | `default` |
| `-pm, --package-manager <pm>` | Package manager | `bun` |
| `--skip-install` | Skip dependency installation | `false` |
| `--skip-git` | Skip git initialization | `false` |

### Examples

```bash
# Interactive mode
mfe-forge init

# With options
mfe-forge init my-project --package-manager pnpm
```

## `mfe-forge generate <type> [name]`

Generate applications, hosts, or packages.

### Types

| Type | Description |
|------|-------------|
| `app` | Micro Frontend application |
| `host` | Host/shell application |
| `package` | Shared package |
| `library` | Component library |
| `design-system` | Design system with Storybook |

### Options

| Option | Description |
|--------|-------------|
| `--port <port>` | Development server port |
| `--host <host>` | Target host for registration |
| `--scope <scope>` | Scope/team for the app |
| `--features <features>` | Comma-separated features |
| `--skip-host` | Skip host auto-generation |

### Examples

```bash
# Simple app
mfe-forge generate app dashboard

# Scoped app (creates apps/stockly/auth)
mfe-forge generate app stockly/auth

# With explicit port
mfe-forge generate app stockly/auth --port 3005

# Override host
mfe-forge generate app marketing/landing --host stockly/host

# Package
mfe-forge generate package ui
```

## `mfe-forge dev`

Start development servers.

### Options

| Option | Description |
|--------|-------------|
| `-s, --scope <scope>` | Run only apps in scope |
| `-a, --app <app>` | Run specific app |
| `-p, --parallel <n>` | Max parallel processes |
| `--host-only` | Run only hosts |
| `--build-watch` | Use build --watch + preview |

### Examples

```bash
# Run all
mfe-forge dev

# Run scope
mfe-forge dev --scope stockly

# Run single app
mfe-forge dev --app stockly/auth
```

## `mfe-forge build [app]`

Build for production.

### Options

| Option | Description |
|--------|-------------|
| `-s, --scope <scope>` | Build all apps in scope |
| `--analyze` | Analyze bundle size |
| `--parallel` | Build in parallel |

## `mfe-forge sync`

Synchronize configurations across MFEs.

### Options

| Option | Description |
|--------|-------------|
| `--types` | Sync TypeScript declarations |
| `--hosts` | Sync host configurations |
| `--routes` | Sync route registrations |

Without options, runs all sync operations.

## `mfe-forge test`

Run tests.

### Options

| Option | Description |
|--------|-------------|
| `-u, --unit` | Unit tests only |
| `-e, --e2e` | E2E tests only |
| `-c, --coverage` | Coverage report |
| `-w, --watch` | Watch mode |

## `mfe-forge doctor`

Diagnose common issues:
- Node version compatibility
- Port conflicts
- Missing hosts
- Workspace configuration

## `mfe-forge config`

Manage configuration interactively or view settings.
