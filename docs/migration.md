# Migration Guide

## Migrating from Existing MFE Setup

### From Manual Vite + Module Federation

1. **Initialize MFE Forge in your project root:**
   ```bash
   npx mfe-forge init --skip-install
   ```

2. **Move existing apps to `apps/` directory:**
   ```
   apps/
   ├── your-scope/
   │   ├── host/       # Your existing shell app
   │   ├── app1/       # Your existing MFEs
   │   └── app2/
   ```

3. **Update vite.config.ts files:**
   ```ts
   // Add shared dependencies via MFE Forge conventions
   shared: {
     react: { singleton: true, requiredVersion: '^19.1.0' },
     'react-dom': { singleton: true, requiredVersion: '^19.1.0' },
   }
   ```

4. **Run sync:**
   ```bash
   npx mfe-forge sync
   ```

### From Webpack Module Federation

1. **Convert webpack configs to Vite:**
   MFE Forge uses Vite with `@originjs/vite-plugin-federation`.

2. **Update entry points:**
   - Webpack: `bootstrap.js`
   - Vite: `bootstrap.tsx`

3. **Replace HtmlWebpackPlugin with `index.html`:**
   ```html
   <!DOCTYPE html>
   <html>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```

### From Single SPA

1. **Remove single-spa adapters:**
   MFE Forge uses native Module Federation instead of single-spa.

2. **Update root component exports:**
   ```tsx
   // Export for Module Federation
   export default function App() { ... }
   ```

3. **Register in host:**
   ```tsx
   const RemoteApp = React.lazy(() => import('remoteApp/App'))
   ```

## Gradual Migration Strategy

For large codebases, migrate incrementally:

1. **Start with new MFEs** using MFE Forge
2. **Wrap legacy apps** in iframe within new host
3. **Migrate one MFE at a time** to native Module Federation
4. **Use event bus** for communication between old and new MFEs

## Configuration Migration

Move your existing config to `mfeforge.config.ts`:

```ts
export default {
  name: 'my-project',
  defaults: {
    framework: 'react',
    styling: 'tailwind',
    packageManager: 'pnpm'
  },
  federation: {
    shared: ['react', 'react-dom', 'react-router-dom', 'zustand']
  }
}
```
