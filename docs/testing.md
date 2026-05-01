# Testing Guide

MFE Forge provides first-class testing support for both unit and E2E testing across your Micro Frontend architecture.

## Unit Testing with Vitest

Each generated app includes Vitest configuration out of the box.

### Testing a Component

```tsx
// src/components/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { renderMFE } from '@mfe-forge/testing'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = renderMFE(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
```

### Testing with Stores

```tsx
import { useGlobalStore } from '@mfe-forge/store'

it('updates user state', () => {
  const { setUser } = useGlobalStore.getState()
  setUser({ id: '1', name: 'Test User', email: 'test@example.com', roles: [] })

  expect(useGlobalStore.getState().user?.name).toBe('Test User')
})
```

## E2E Testing with Playwright

### Cross-MFE Navigation

```ts
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'
import { e2eHelpers } from '@mfe-forge/testing'

test('user can navigate between MFEs', async ({ page }) => {
  await page.goto('/')

  // Navigate to auth MFE
  await e2eHelpers.navigateToMFE(page, 'auth', '/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')

  // Should redirect to dashboard
  await e2eHelpers.navigateToMFE(page, 'dashboard', '/')
  await e2eHelpers.assertMFERendered(page, 'dashboard')
})
```

### Testing Remote Module Loading

```ts
test('remote module loads without errors', async ({ page }) => {
  await page.goto('/dashboard')

  // Wait for remote to be visible
  await e2eHelpers.waitForRemote(page, 'dashboardApp')

  // Verify no error boundaries triggered
  const error = await page.$('[data-testid="mfe-error"]')
  expect(error).toBeNull()
})
```

## Running Tests

```bash
# Run all unit tests
mfe-forge test --unit

# Run E2E tests
mfe-forge test --e2e

# With coverage
mfe-forge test --coverage

# Watch mode
mfe-forge test --watch

# Specific app
mfe-forge test stockly/dashboard
```

## Mocking Remote Modules

In unit tests, mock federated modules:

```ts
import { mockRemoteModule } from '@mfe-forge/testing'
import { vi } from 'vitest'

mockRemoteModule('dashboardApp/App', () => <div>Mock Dashboard</div>)
```

## Best Practices

1. **Test each MFE in isolation** — Unit test components without loading remotes
2. **Use E2E for integration** — Test cross-MFE flows with Playwright
3. **Mock the event bus** — Use `@mfe-forge/testing` utilities to mock events
4. **Test error boundaries** — Verify graceful degradation when remotes fail
