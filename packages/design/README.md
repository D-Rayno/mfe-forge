# @mfe-forge/design

> Design system utilities and tokens for MFE Forge

Part of the [MFE Forge](https://github.com/D-Rayno/mfe-forge) framework.

## Features

- **Design Tokens**: Centralized theme tokens (colors, spacing, typography)
- **Token Manager**: Apply tokens to the DOM as CSS variables
- **Tailwind Integration**: Pre-configured Tailwind theme based on tokens

## Installation

```bash
npm install @mfe-forge/design
# or
bun add @mfe-forge/design
```

## Usage

### Applying Tokens
```ts
import { applyTokens } from '@mfe-forge/design';

// Apply tokens to document root
applyTokens(document.documentElement);
```

### Accessing Tokens
```ts
import { tokens } from '@mfe-forge/design';

console.log(tokens.colors.primary);
```

## License

MIT
