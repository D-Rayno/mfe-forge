/** Configuration for an MFE Forge project, stored in `mfeforge.config.ts`. */
export interface MFEConfig {
  name: string
  organization?: string
  scopes?: string[]
  registry?: {
    url: string
    auth?: string
  }
  defaults: {
    framework: 'react' | 'vue' | 'svelte'
    language: 'typescript' | 'javascript'
    styling: 'tailwind' | 'css-modules' | 'styled-components' | 'none'
    stateManagement: 'zustand' | 'redux' | 'jotai' | 'none'
    packageManager: 'bun' | 'pnpm' | 'npm'
  }
  federation: {
    plugin: '@originjs/vite-plugin-federation' | '@module-federation/vite'
    shared: string[]
    runtimePlugin?: string
  }
  dev: {
    autoStartHost: boolean
    parallelLimit: number
    portRange: [number, number]
    cors: boolean
  }
  build: {
    target: string | string[]
    minify: boolean
    cssCodeSplit: boolean
    sourcemap: boolean
  }
  testing: {
    unit: 'vitest' | 'jest' | 'none'
    e2e: 'playwright' | 'cypress' | 'none'
    coverage: boolean
  }
  designSystem: {
    enabled: boolean
    tokens: boolean
    storybook: boolean
  }
  ci: {
    provider: 'github' | 'gitlab' | 'azure' | 'none'
    docker: boolean
    deployTarget: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'none'
  }
}

/** Context for a single app/host/package being generated or managed. */
export interface AppContext {
  name: string
  scope?: string
  type: 'app' | 'host' | 'package' | 'design-system' | 'library'
  port?: number
  template?: string
  host?: string
  features?: string[]
}

/** Full project context including config, directories, and discovered scopes. */
export interface ProjectContext {
  rootDir: string
  config: MFEConfig
  appsDir: string
  packagesDir: string
  scopes: string[]
}

/** Descriptor for a discovered remote MFE application. */
export interface RemoteApp {
  name: string
  scope: string
  port: number
  url: string
  camelName: string
  pascalName: string
  packageName: string
  entry: string
}
