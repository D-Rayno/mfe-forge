# Publishing Checklist for MFE Forge

## Pre-Publication Steps

### 1. Choose Package Manager for Distribution

MFE Forge should be published to **npm** (which also serves pnpm and Bun via npm registry).

```bash
# Login to npm
npm login

# Verify
npm whoami
```

### 2. Ensure Package Names Are Available

Check availability:
```bash
npm view mfe-forge
npm view @mfe-forge/core
npm view @mfe-forge/router
npm view @mfe-forge/store
npm view @mfe-forge/design
npm view @mfe-forge/testing
```

If taken, consider alternatives:
- `mfe-forge` → `@D-Rayno/mfe-forge`
- Or namespace everything: `@mfe-forge/cli`, `@mfe-forge/core`, etc.

### 3. Update package.json Files

Ensure each package has:
- Correct `name` and `version`
- `publishConfig.access: "public"` (for scoped packages)
- `files` array includes only what's needed
- Proper `engines` field
- `repository` and `license` fields

### 4. Build All Packages

```bash
cd mfe-forge
bun install
bun run build
```

### 5. Test Locally

```bash
# Link CLI locally
bun link

# Test in a temp directory
cd /tmp
mfe-forge init test-project
cd test-project
mfe-forge generate host myscope/host
mfe-forge generate app myscope/app1
```

### 6. Add Changeset

```bash
bun changeset
# Select packages and describe changes
```

### 7. Version Packages

```bash
bun version-packages
# This bumps versions and updates changelogs
```

### 8. Publish

```bash
# Publish all packages
bun release

# Or manually:
cd packages/cli && npm publish --access public
cd packages/core && npm publish --access public
# ... etc
```

### 9. Verify Installation

```bash
# Global install
npm install -g mfe-forge
mfe-forge --version

# Local install
npm install --save-dev mfe-forge
npx mfe-forge --version
```

### 10. Publish Documentation

```bash
cd docs
bun run docs:build
# Deploy to GitHub Pages / Vercel / Netlify
```

## Post-Publication

- [ ] Create GitHub release with changelog
- [ ] Announce on social media / dev communities
- [ ] Update README with installation instructions
- [ ] Monitor for issues and feedback
- [ ] Set up automated publishing via GitHub Actions

## GitHub Actions for Auto-Publish

```yaml
# .github/workflows/publish.yml
name: Publish
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run test
      - uses: changesets/action@v1
        with:
          publish: bun release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
