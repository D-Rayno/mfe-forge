# Configuration

MFE Forge is configured via `mfeforge.config.ts` in your project root.

## Configuration File

```ts
export default {
  name: 'my-platform',
  organization: 'acme',

  defaults: {
    framework: 'react',
    language: 'typescript',
    styling: 'tailwind',
    stateManagement: 'zustand',
    packageManager: 'bun'
  },

  federation: {
    plugin: '@originjs/vite-plugin-federation',
    shared: ['react', 'react-dom', 'react-router-dom', 'zustand']
  },

  dev: {
    autoStartHost: true,
    parallelLimit: 10,
    portRange: [3000, 3999],
    cors: true
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: true
  },

  testing: {
    unit: 'vitest',
    e2e: 'playwright',
    coverage: true
  },

  designSystem: {
    enabled: true,
    tokens: true,
    storybook: true
  },

  ci: {
    provider: 'github',
    docker: true,
    deployTarget: 'vercel'
  }
}
```

## Configuration Options

### `name`
- **Type**: `string`
- **Description**: Project name

### `organization`
- **Type**: `string` (optional)
- **Description**: NPM organization scope (e.g., `@acme`)

### `defaults`
- **Type**: `object`
- **Properties**:
  - `framework`: `'react' | 'vue' | 'svelte'`
  - `language`: `'typescript' | 'javascript'`
  - `styling`: `'tailwind' | 'css-modules' | 'styled-components' | 'none'`
  - `stateManagement`: `'zustand' | 'redux' | 'jotai' | 'none'`
  - `packageManager`: `'bun' | 'pnpm' | 'npm'`

### `federation`
- **Type**: `object`
- **Properties**:
  - `plugin`: Module federation plugin to use
  - `shared`: Array of shared dependency names
  - `runtimePlugin`: Custom runtime plugin path

### `dev`
- **Type**: `object`
- **Properties**:
  - `autoStartHost`: Automatically start host with apps
  - `parallelLimit`: Maximum parallel dev servers
  - `portRange`: [min, max] port range
  - `cors`: Enable CORS in dev server

### `build`
- **Type**: `object`
- **Properties**:
  - `target`: Build target
  - `minify`: Enable minification
  - `cssCodeSplit`: Split CSS into chunks
  - `sourcemap`: Generate source maps

### `testing`
- **Type**: `object`
- **Properties**:
  - `unit`: Unit testing framework
  - `e2e`: E2E testing framework
  - `coverage`: Generate coverage reports

### `designSystem`
- **Type**: `object`
- **Properties**:
  - `enabled`: Enable design system
  - `tokens`: Generate design tokens
  - `storybook`: Include Storybook

### `ci`
- **Type**: `object`
- **Properties**:
  - `provider`: CI provider
  - `docker`: Include Docker support
  - `deployTarget`: Deployment target
