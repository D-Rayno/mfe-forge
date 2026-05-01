import { tokens } from './tokens.js';
export { tokens } from './tokens.js';
export type { TokenPath } from './tokens.js';

// Utility to apply CSS variables from tokens
export function applyTokens(element: HTMLElement = document.documentElement) {
  const { colors, radius, font } = tokens;

  Object.entries(colors).forEach(([key, value]) => {
    element.style.setProperty(`--color-${key}`, value as string);
  });

  Object.entries(radius).forEach(([key, value]) => {
    element.style.setProperty(`--radius-${key}`, value as string);
  });

  element.style.setProperty('--font-sans', font.sans);
  element.style.setProperty('--font-mono', font.mono);
}
