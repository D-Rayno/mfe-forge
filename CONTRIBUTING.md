# Contributing to MFE Forge

Thank you for your interest in contributing to MFE Forge! This document provides guidelines for contributing to the project.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/D-Rayno/mfe-forge.git
cd mfe-forge

# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test
```

## Project Structure

```
mfe-forge/
├── packages/
│   ├── cli/          # Core CLI tool
│   ├── core/         # Runtime utilities
│   ├── router/       # Routing coordination
│   ├── store/        # State management
│   ├── design/       # Design tokens
│   └── testing/      # Testing utilities
├── templates/        # Project templates
└── docs/             # Documentation
```

## Making Changes

1. Create a new branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Add tests if applicable
4. Run `bun run lint` and `bun run type-check`
5. Commit with conventional commits: `feat: add new command`
6. Push and create a PR

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

## Adding Templates

To add a new template:

1. Create a directory in `packages/cli/src/templates/`
2. Add template files with Mustache variables
3. Update the `copyTemplate` utility if needed
4. Add documentation

## Releasing

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
# Add a changeset
bun changeset

# Version packages
bun version-packages

# Publish
bun release
```
