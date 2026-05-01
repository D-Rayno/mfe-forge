export const tokens = {
  colors: {
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    'card-foreground': 'oklch(0.985 0 0)',
    border: 'oklch(0.295 0 0)',
    input: 'oklch(0.295 0 0)',
    primary: 'oklch(0.82 0.2 128)',
    'primary-foreground': 'oklch(0.145 0 0)',
    muted: 'oklch(0.205 0 0)',
    'muted-foreground': 'oklch(0.556 0 0)',
    destructive: 'oklch(0.577 0.245 27.33)',
    ring: 'oklch(0.556 0 0)'
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  font: {
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
} as const;

export type TokenPath = keyof typeof tokens;
