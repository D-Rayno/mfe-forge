# @mfe-forge/store

> Shared state management for MFE Forge

Part of the [MFE Forge](https://github.com/D-Rayno/mfe-forge) framework.

## Features

- **Zustand Persistence**: Seamless state sharing across MFEs
- **Automatic Sync**: Sync state between host and remotes
- **Type Safety**: Fully typed store utilities

## Installation

```bash
npm install @mfe-forge/store
# or
bun add @mfe-forge/store
```

## Usage

### Creating a Sync Store
```ts
import { createSyncStore } from '@mfe-forge/store';

const useUserStore = createSyncStore('user', (set) => ({
  name: 'Guest',
  setName: (name) => set({ name }),
}));
```

## License

MIT
