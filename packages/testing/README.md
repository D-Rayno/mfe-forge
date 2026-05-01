# @mfe-forge/testing

> Testing utilities for MFE Forge

Part of the [MFE Forge](https://github.com/D-Rayno/mfe-forge) framework.

## Features

- **MFE Mocks**: Automatically mock Module Federation remotes
- **Render Helpers**: `renderMFE` for testing components in a simulated host environment
- **Vitest Config**: Shared Vitest configuration for monorepos

## Installation

```bash
npm install @mfe-forge/testing
# or
bun add @mfe-forge/testing
```

## Usage

### Testing a Remote MFE
```ts
import { renderMFE } from '@mfe-forge/testing';
import { MyRemote } from './App';

test('renders correctly', () => {
  renderMFE(<MyRemote />);
});
```

## License

MIT
