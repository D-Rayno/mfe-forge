import { cosmiconfigSync } from 'cosmiconfig'
import { z } from 'zod'
import path from 'path'
import fs from 'fs-extra'
import type { MFEConfig } from '../types/index.js'

/**
 * Zod schema for validating and providing defaults to the MFE Forge configuration.
 * Each section has sensible defaults so users only need to specify overrides.
 */
const configSchema = z.object({
  name: z.string().min(1),
  organization: z.string().optional(),
  scopes: z.array(z.string()).optional(),
  registry: z
    .object({
      url: z.string().url(),
      auth: z.string().optional(),
    })
    .optional(),
  defaults: z
    .object({
      framework: z.enum(['react', 'vue', 'svelte']).default('react'),
      language: z.enum(['typescript', 'javascript']).default('typescript'),
      styling: z.enum(['tailwind', 'css-modules', 'styled-components', 'none']).default('tailwind'),
      stateManagement: z.enum(['zustand', 'redux', 'jotai', 'none']).default('zustand'),
      packageManager: z.enum(['bun', 'pnpm', 'npm']).default('bun'),
    })
    .default({}),
  federation: z
    .object({
      plugin: z
        .enum(['@originjs/vite-plugin-federation', '@module-federation/vite'])
        .default('@originjs/vite-plugin-federation'),
      shared: z.array(z.string()).default(['react', 'react-dom', 'react-router-dom']),
      runtimePlugin: z.string().optional(),
    })
    .default({}),
  dev: z
    .object({
      autoStartHost: z.boolean().default(true),
      parallelLimit: z.number().int().positive().default(10),
      portRange: z.tuple([z.number(), z.number()]).default([3000, 3999]),
      cors: z.boolean().default(true),
    })
    .default({}),
  build: z
    .object({
      target: z.union([z.string(), z.array(z.string())]).default('esnext'),
      minify: z.boolean().default(false),
      cssCodeSplit: z.boolean().default(false),
      sourcemap: z.boolean().default(true),
    })
    .default({}),
  testing: z
    .object({
      unit: z.enum(['vitest', 'jest', 'none']).default('vitest'),
      e2e: z.enum(['playwright', 'cypress', 'none']).default('playwright'),
      coverage: z.boolean().default(true),
    })
    .default({}),
  designSystem: z
    .object({
      enabled: z.boolean().default(true),
      tokens: z.boolean().default(true),
      storybook: z.boolean().default(true),
    })
    .default({}),
  ci: z
    .object({
      provider: z.enum(['github', 'gitlab', 'azure', 'none']).default('github'),
      docker: z.boolean().default(true),
      deployTarget: z.enum(['vercel', 'netlify', 'aws', 'gcp', 'none']).default('none'),
    })
    .default({}),
})

/** Cosmiconfig explorer for finding mfeforge config files (mfeforge.config.ts, .mfeforgerc, etc.) */
const explorer = cosmiconfigSync('mfeforge')

/**
 * Loads and validates the MFE Forge configuration from the project root.
 * Uses cosmiconfig to search for `mfeforge.config.ts`, `.mfeforgerc`, etc.
 * If no config file is found, returns a default configuration.
 *
 * @param cwd - Working directory to search for config (defaults to process.cwd())
 * @returns Validated and fully-resolved MFE configuration
 */
export function loadConfig(cwd = process.cwd()): MFEConfig {
  const result = explorer.search(cwd)

  if (!result || result.isEmpty) {
    const defaultConfig = configSchema.parse({ name: 'mfe-project' })
    return defaultConfig as MFEConfig
  }

  const parsed = configSchema.parse(result.config)
  return parsed as MFEConfig
}

/**
 * Persists the given configuration to `mfeforge.config.ts` in the project root.
 * Wraps the config in a `defineConfig()` call for type safety.
 *
 * @param config - Partial config to write (will be JSON-serialized)
 * @param cwd - Directory to write the config file to
 */
export async function saveConfig(config: Partial<MFEConfig>, cwd = process.cwd()) {
  const configPath = path.join(cwd, 'mfeforge.config.ts')
  const content = `import { defineConfig } from 'mfe-forge';

export default defineConfig(${JSON.stringify(config, null, 2)});
`
  await fs.writeFile(configPath, content)
}

/**
 * Identity function that provides TypeScript autocomplete for MFE Forge configuration.
 * Use this in `mfeforge.config.ts` for IDE support.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'mfe-forge'
 * export default defineConfig({ name: 'my-project' })
 * ```
 */
export function defineConfig(config: Partial<MFEConfig>): Partial<MFEConfig> {
  return config
}

/**
 * Builds the complete project context by loading the config and discovering
 * the filesystem layout (apps directory, packages directory, scopes).
 *
 * @param cwd - Project root directory (defaults to process.cwd())
 * @returns Project context with config, directory paths, and discovered scopes
 */
export function getProjectContext(cwd = process.cwd()) {
  const config = loadConfig(cwd)
  const rootDir = cwd
  const appsDir = path.join(rootDir, 'apps')
  const packagesDir = path.join(rootDir, 'packages')

  // Discover scopes from filesystem by finding directories that contain sub-app directories
  const scopes: string[] = []
  if (fs.existsSync(appsDir)) {
    const entries = fs.readdirSync(appsDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subEntries = fs.readdirSync(path.join(appsDir, entry.name), { withFileTypes: true })
        const hasSubApps = subEntries.some(
          (e) =>
            e.isDirectory() &&
            fs.existsSync(path.join(appsDir, entry.name, e.name, 'vite.config.ts'))
        )
        if (hasSubApps) scopes.push(entry.name)
      }
    }
  }

  return { rootDir, config, appsDir, packagesDir, scopes }
}
