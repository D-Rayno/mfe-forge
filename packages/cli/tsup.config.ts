import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bin/index.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  splitting: false,
  sourcemap: true,
  external: [
    'commander',
    'chalk',
    'inquirer',
    'ora',
    'fs-extra',
    'globby',
    'execa',
    'zod',
    'cosmiconfig',
    'mustache',
    'listr2',
    'portfinder',
    'node-fetch',
    'semver',
    'yaml'
  ]
})
