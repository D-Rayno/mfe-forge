import { describe, expect, it } from 'vitest'
import { applyTokens } from './index.js'

describe('applyTokens', () => {
  it('writes color, radius and font tokens to the target element', () => {
    const target = document.createElement('div')

    applyTokens(target)

    expect(target.style.getPropertyValue('--color-background')).toBe('oklch(0.145 0 0)')
    expect(target.style.getPropertyValue('--radius-md')).toBe('0.5rem')
    expect(target.style.getPropertyValue('--font-sans')).toContain('Inter')
    expect(target.style.getPropertyValue('--font-mono')).toContain('JetBrains Mono')
  })
})
