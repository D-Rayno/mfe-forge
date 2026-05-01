# Troubleshooting

## Common Issues

### Port Already in Use

```
Error: Port 3001 is already in use
```

**Solution:**
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use a different port
mfe-forge generate app scope/name --port 3005
```

### Remote Module Not Found

```
Error: Cannot find module 'authApp/App'
```

**Solution:**
```bash
# Sync host configuration
mfe-forge sync

# Verify remote is running
mfe-forge dev --app scope/auth
```

### TypeScript Declaration Errors

```
Cannot find module 'remoteApp/App' or its corresponding type declarations
```

**Solution:**
```bash
# Regenerate declarations
mfe-forge sync --types

# Check host's declarations.d.ts
```

### CORS Errors in Development

```
Access to script at 'http://localhost:3001/...' from origin 'http://localhost:3000' has been blocked
```

**Solution:**
CORS is enabled by default in dev mode. If issues persist:

```ts
// vite.config.ts
server: {
  cors: {
    origin: '*',
    credentials: true
  }
}
```

### Shared Dependency Mismatch

```
Uncaught Error: Shared module react doesn't exist in shared scope default
```

**Solution:**
Ensure all MFEs use the same version:

```json
// package.json (all MFEs)
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

### Build Failures

```
Error: Could not resolve entry module "src/bootstrap.tsx"
```

**Solution:**
```bash
# Check file exists
ls apps/scope/app/src/bootstrap.tsx

# Regenerate if missing
mfe-forge generate app scope/app --force
```

### Event Bus Not Working Across MFEs

**Solution:**
Ensure you're using the singleton:

```ts
// Correct
import { globalEventBus } from '@mfe-forge/core'

// Incorrect (creates new instance)
import { EventBus } from '@mfe-forge/core'
const bus = new EventBus()
```

### Hot Reload Not Working

**Solution:**
```bash
# Use build --watch mode
mfe-forge dev --build-watch

# Or restart the specific app
mfe-forge dev --app scope/app
```

## Diagnostic Commands

```bash
# Check project health
mfe-forge doctor

# View configuration
mfe-forge config --get defaults.packageManager

# List all apps and ports
mfe-forge sync --dry-run
```

## Getting Help

1. Run `mfe-forge doctor` for automated diagnostics
2. Check the [documentation](https://mfe-forge.dev)
3. Search [GitHub Issues](https://github.com/D-Rayno/mfe-forge/issues)
4. Join our [Discord community](https://discord.gg/mfe-forge)
