# Installation

## Requirements

- **Node.js** >= 20.0.0 (or Bun >= 1.1.0)
- **Package Manager**: npm, pnpm, or Bun

## Global Installation

Install MFE Forge globally to use the CLI anywhere:

::: code-group

```bash [npm]
npm install -g mfe-forge
```

```bash [pnpm]
pnpm add -g mfe-forge
```

```bash [bun]
bun add -g mfe-forge
```

:::

## Project-local Installation

Install as a dev dependency in your project:

::: code-group

```bash [npm]
npm install --save-dev mfe-forge
```

```bash [pnpm]
pnpm add -D mfe-forge
```

```bash [bun]
bun add -D mfe-forge
```

:::

## Verify Installation

```bash
mfe-forge --version
```

## Tab Completion

### Bash
```bash
mfe-forge completion bash >> ~/.bashrc
```

### Zsh
```bash
mfe-forge completion zsh >> ~/.zshrc
```

### Fish
```bash
mfe-forge completion fish > ~/.config/fish/completions/mfe-forge.fish
```
