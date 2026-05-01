# @mfe-forge/router

> Routing coordination utilities for MFE Forge

Part of the [MFE Forge](https://github.com/D-Rayno/mfe-forge) framework.

## Features

- **Scoped Routing**: Utilities for managing nested routes in MFEs
- **Global Coordination**: Sync history across different MFEs
- **React Router Integration**: Custom hooks and components for MFE routing

## Installation

```bash
npm install @mfe-forge/router
# or
bun add @mfe-forge/router
```

## Usage

### MFE Router
```tsx
import { MFERouter } from '@mfe-forge/router';

const App = () => (
  <MFERouter base="/dashboard">
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </MFERouter>
);
```

## License

MIT
