import { tokens } from './tokens.js'
export { tokens } from './tokens.js'
export type { TokenPath } from './tokens.js'

/**
 * Applies the MFE Forge design tokens as CSS custom properties on an HTML element.
 * By default, applies tokens to the document root element, making them available
 * globally via `var(--color-*)`, `var(--radius-*)`, etc.
 *
 * @param element - Target HTML element to set CSS variables on (defaults to `<html>`)
 *
 * @example
 * ```tsx
 * // Apply tokens on app startup
 * import { applyTokens } from '@mfe-forge/design'
 * applyTokens() // sets CSS vars on document.documentElement
 * ```
 */
export function applyTokens(element: HTMLElement = document.documentElement) {
  const { colors, radius, font } = tokens

  Object.entries(colors).forEach(([key, value]) => {
    element.style.setProperty(`--color-${key}`, value as string)
  })

  Object.entries(radius).forEach(([key, value]) => {
    element.style.setProperty(`--radius-${key}`, value as string)
  })

  element.style.setProperty('--font-sans', font.sans)
  element.style.setProperty('--font-mono', font.mono)
}
