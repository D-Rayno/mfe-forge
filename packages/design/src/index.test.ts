import { describe, expect, it } from 'vitest'
import { applyTokens } from './index.js'

describe('applyTokens', () => {
  it('writes color, radius and font tokens to the target element', () => {
    const values = new Map<string, string>()
    const target = {
      style: {
        setProperty: (name: string, value: string) => {
          values.set(name, value)
        },
      },
    } as unknown as HTMLElement

    applyTokens(target)

    expect(values.get('--color-background')).toBe('oklch(0.145 0 0)')
    expect(values.get('--radius-md')).toBe('0.5rem')
    expect(values.get('--font-sans')).toContain('Inter')
    expect(values.get('--font-mono')).toContain('JetBrains Mono')
  })
})
