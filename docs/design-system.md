# Design System Guide

MFE Forge includes built-in design system support to ensure visual consistency across all Micro Frontends.

## Design Tokens

Tokens are the single source of truth for your design system.

```ts
import { tokens } from '@mfe-forge/design'

// Access colors
const primaryColor = tokens.colors.primary

// Access spacing
const padding = tokens.spacing.lg
```

### Customizing Tokens

Create a custom design system package:

```bash
mfe-forge generate design-system @acme/design
```

Edit `src/tokens/index.ts`:

```ts
export const customTokens = {
  colors: {
    brand: '#ff6b6b',
    'brand-light': '#ff8787',
  },
  spacing: {
    '3xl': '4rem',
  }
} as const
```

## Using Components

Import from your design system package:

```tsx
import { Button, Card, Input } from '@acme/design'

function MyComponent() {
  return (
    <Card>
      <h2>Login</h2>
      <Input placeholder="Email" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## Storybook

Each design system package includes Storybook for component documentation.

```bash
cd packages/design
bun run dev
```

### Writing Stories

```tsx
// src/components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
}
```

## Tailwind Configuration

All apps share the same Tailwind theme through CSS variables:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.82 0.2 128);
  --font-sans: "Inter", system-ui, sans-serif;
}
```

## Dark Mode

Toggle dark mode via the global store:

```tsx
import { useGlobalStore } from '@mfe-forge/store'

function ThemeToggle() {
  const { theme, setTheme } = useGlobalStore()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

Add to your CSS:

```css
@layer base {
  [data-theme="dark"] {
    --color-background: oklch(0.145 0 0);
    --color-foreground: oklch(0.985 0 0);
  }

  [data-theme="light"] {
    --color-background: oklch(0.985 0 0);
    --color-foreground: oklch(0.145 0 0);
  }
}
```
