# Publishing Guide

This guide covers publishing MFE Forge and your MFE applications.

## Publishing MFE Forge Framework

### Prerequisites

1. NPM account with 2FA enabled
2. Organization scope configured (e.g., `@mfe-forge`)
3. Changesets configured

### Versioning

```bash
# Add a changeset
bun changeset

# Version packages
bun version-packages

# Publish to NPM
bun release
```

### Publishing Individual Packages

```bash
cd packages/cli
npm publish --access public

cd packages/core
npm publish --access public
```

## Publishing Your MFE Applications

### Docker Deployment

Build Docker images for each MFE:

```bash
# Generate Dockerfiles
mfe-forge generate docker --scope stockly

# Build images
docker-compose build

# Push to registry
docker-compose push
```

### Static Hosting

For static hosting (Vercel, Netlify, AWS S3):

```bash
# Build all apps
mfe-forge build

# Each app's dist folder can be deployed independently
# apps/stockly/auth/dist -> auth.yourdomain.com
# apps/stockly/dashboard/dist -> dashboard.yourdomain.com
```

### CDN Deployment

For production Module Federation, host remotes on a CDN:

```ts
// vite.config.ts (host)
federation({
  remotes: {
    authApp: 'https://cdn.yourdomain.com/auth/assets/remoteEntry.js',
    dashboardApp: 'https://cdn.yourdomain.com/dashboard/assets/remoteEntry.js',
  }
})
```

## Environment Configuration

Create `.env` files for each environment:

```bash
# .env.development
VITE_AUTH_URL=http://localhost:3001
VITE_API_URL=http://localhost:8080

# .env.production
VITE_AUTH_URL=https://auth.yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

## CI/CD Pipeline

MFE Forge generates GitHub Actions workflows for:

1. **Lint & Type Check** — On every PR
2. **Unit Tests** — On every PR
3. **Build** — On merge to main
4. **Deploy** — On release

### Manual Deployment

```bash
# Build specific scope
mfe-forge build --scope stockly

# Deploy to staging
mfe-forge deploy --scope stockly --env staging

# Deploy to production
mfe-forge deploy --scope stockly --env production
```

## Registry Configuration

For private registries, configure `mfeforge.config.ts`:

```ts
export default {
  registry: {
    url: 'https://npm.yourcompany.com',
    auth: process.env.NPM_AUTH_TOKEN
  }
}
```
