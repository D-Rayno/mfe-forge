import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadConfig } from './config.js'

describe('loadConfig', () => {
  it('loads defaults and derives the project name from the working directory', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mfe-forge-config-test-'))

    try {
      const config = loadConfig(root)

      expect(config.name).toBe(path.basename(root))
      expect(config.defaults.packageManager).toBe('bun')
      expect(config.dev.portRange).toEqual([3000, 3999])
    } finally {
      await fs.remove(root)
    }
  })
})
