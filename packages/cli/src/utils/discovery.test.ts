import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { discoverApps, discoverHosts } from './discovery.js'

describe('discovery', () => {
  it('discovers remote apps and hosts from a scoped workspace', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mfe-forge-discovery-test-'))
    const appsDir = path.join(root, 'apps')

    try {
      await fs.outputFile(
        path.join(appsDir, 'checkout', 'cart', 'vite.config.ts'),
        'export default { server: { port: 3201 } }\n'
      )
      await fs.outputFile(
        path.join(appsDir, 'checkout', 'host', 'vite.config.ts'),
        'export default { server: { port: 3200 } }\n'
      )

      const context = {
        rootDir: root,
        appsDir,
        packagesDir: path.join(root, 'packages'),
        config: {
          organization: 'acme',
        },
        scopes: ['checkout'],
      } as any

      expect(discoverHosts(context)).toEqual(['checkout/host'])
      const apps = discoverApps(context)
      expect(apps).toHaveLength(2)

      const names = apps.map((app) => app.name).sort()
      expect(names).toEqual(['checkout/cart', 'checkout/host'])

      const cart = apps.find((app) => app.name === 'checkout/cart')
      expect(cart).toMatchObject({
        scope: 'checkout',
        port: 3201,
        federationName: 'checkoutCartApp',
      })
    } finally {
      await fs.remove(root)
    }
  })
})
