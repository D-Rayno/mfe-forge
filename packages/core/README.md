# @mfe-forge/core

> Core runtime utilities for MFE Forge applications

Part of the [MFE Forge](https://github.com/D-Rayno/mfe-forge) framework.

## Features

- **Error Boundaries**: Production-grade React error boundaries with reporting
- **Event Bus**: Typed cross-MFE communication
- **Remote Loader**: Dynamic loading of MFEs with fallback support
- **Types**: Shared types for the MFE Forge ecosystem

## Installation

```bash
npm install @mfe-forge/core
# or
bun add @mfe-forge/core
```

## Usage

### Error Boundary
```tsx
import { MFErrorBoundary } from '@mfe-forge/core';

<MFErrorBoundary fallback={<div>Failed to load</div>}>
  <RemoteApp />
</MFErrorBoundary>
```

### Event Bus
```ts
import { eventBus } from '@mfe-forge/core';

// Subscribe
eventBus.on('user_logged_in', (data) => {
  console.log('User logged in:', data);
});

// Publish
eventBus.emit('user_logged_in', { id: '123' });
```

## License

MIT
