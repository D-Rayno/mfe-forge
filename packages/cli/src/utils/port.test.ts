import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { getUsedPorts } from './port.js'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

describe('getUsedPorts', () => {
  it('discovers ports from Vite configs and dev scripts', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mfe-forge-port-test-'))
    tempDirs.push(dir)

    await fs.outputFile(
      path.join(dir, 'scope', 'app', 'vite.config.ts'),
      'export default { server: { port: 3101 }, preview: { port: 4101 } }\n'
    )
    await fs.outputJson(path.join(dir, 'scope', 'app', 'package.json'), {
      scripts: { dev: 'vite --host 0.0.0.0 --port 3102' },
    })

    expect(getUsedPorts(dir)).toEqual(new Set([3101, 3102]))
  })

  it('ignores node_modules', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mfe-forge-port-test-'))
    tempDirs.push(dir)

    await fs.outputFile(
      path.join(dir, 'node_modules', 'ignored', 'vite.config.ts'),
      'export default { server: { port: 3999 } }\n'
    )

    expect(getUsedPorts(dir)).toEqual(new Set())
  })
})
