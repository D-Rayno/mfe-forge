import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { MFEConfig } from '../types/index.js';

export const initCommand = new Command('init')
  .description('Initialize a new MFE Forge project')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Project template', 'default')
  .option('-pm, --package-manager <pm>', 'Package manager', 'bun')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action(async (name, options) => {
    const spinner = ora();

    try {
      if (!name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Project name:',
            validate: (input) => input.length > 0 || 'Name is required'
          },
          {
            type: 'input',
            name: 'organization',
            message: 'NPM organization (optional, e.g. @acme):',
            default: ''
          },
          {
            type: 'list',
            name: 'packageManager',
            message: 'Package manager:',
            choices: ['bun', 'pnpm', 'npm'],
            default: 'bun'
          },
          {
            type: 'checkbox',
            name: 'features',
            message: 'Select features to enable:',
            choices: [
              { name: 'Design System (Storybook + Tokens)', value: 'designSystem', checked: true },
              { name: 'Testing (Vitest + Playwright)', value: 'testing', checked: true },
              { name: 'Docker Support', value: 'docker', checked: true },
              { name: 'GitHub Actions CI/CD', value: 'ci', checked: true },
              { name: 'TypeScript Strict Mode', value: 'strictTs', checked: true }
            ]
          }
        ]);

        name = answers.name;
        options.packageManager = answers.packageManager;
        options.features = answers.features;
        options.organization = answers.organization;
      }

      const targetDir = path.resolve(process.cwd(), name);

      if (await fs.pathExists(targetDir)) {
        console.error(chalk.red(`Directory ${name} already exists`));
        process.exit(1);
      }

      spinner.start('Creating project structure...');

      await fs.ensureDir(targetDir);

      const dirs = ['apps', 'packages', 'tools', '.github/workflows'];
      for (const dir of dirs) {
        await fs.ensureDir(path.join(targetDir, dir));
      }

      const config: Partial<MFEConfig> = {
        name,
        organization: options.organization || undefined,
        defaults: {
          framework: 'react',
          language: 'typescript',
          styling: 'tailwind',
          stateManagement: 'zustand',
          packageManager: options.packageManager
        },
        federation: {
          plugin: '@originjs/vite-plugin-federation',
          shared: ['react', 'react-dom', 'react-router-dom']
        },
        designSystem: {
          enabled: options.features?.includes('designSystem') ?? true,
          tokens: true,
          storybook: true
        },
        testing: {
          unit: options.features?.includes('testing') ? 'vitest' : 'none',
          e2e: options.features?.includes('testing') ? 'playwright' : 'none',
          coverage: true
        },
        ci: {
          provider: options.features?.includes('ci') ? 'github' : 'none',
          docker: options.features?.includes('docker') ?? false,
          deployTarget: 'none'
        }
      };

      await fs.writeFile(
        path.join(targetDir, 'mfeforge.config.ts'),
        `export default ${JSON.stringify(config, null, 2)};`
      );

      const rootPkg = {
        name,
        private: true,
        type: 'module',
        workspaces: ['apps/*', 'packages/*'],
        scripts: {
          'dev': 'mfe-forge dev',
          'dev:host': 'mfe-forge dev --scope',
          'build': 'mfe-forge build',
          'test': 'mfe-forge test',
          'lint': 'eslint .',
          'format': 'prettier --write .',
          'type-check': 'tsc --noEmit',
          'mfe': 'mfe-forge'
        },
        devDependencies: {
          'mfe-forge': '^1.0.0',
          'typescript': '~5.8.3',
          'prettier': '^3.2.5',
          'eslint': '^8.57.0',
          '@types/node': '^20.0.0'
        }
      };

      await fs.writeJson(path.join(targetDir, 'package.json'), rootPkg, { spaces: 2 });

      const tsConfig = {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          allowJs: false,
          checkJs: false,
          declaration: true,
          declarationMap: true,
          sourceMap: true,
          outDir: './dist',
          noEmit: true,
          isolatedModules: true,
          verbatimModuleSyntax: true,
          esModuleInterop: true,
          skipLibCheck: true,
          strict: options.features?.includes('strictTs') ?? true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          forceConsistentCasingInFileNames: true
        }
      };

      await fs.writeJson(path.join(targetDir, 'tsconfig.base.json'), tsConfig, { spaces: 2 });

      await fs.writeFile(path.join(targetDir, '.gitignore'), 
`node_modules
dist
build
*.local
.env
.env.*
!.env.example
.vscode/*
!.vscode/extensions.json
.idea
*.log
.DS_Store
coverage
.nyc_output
*.tsbuildinfo
`);

      await fs.writeFile(path.join(targetDir, 'README.md'),
`# ${name}

Generated with [MFE Forge](https://github.com/D-Rayno/mfe-forge).

## Quick Start

\`\`\`bash
# Install dependencies
${options.packageManager} install

# Start development (runs all MFEs)
${options.packageManager} dev

# Build for production
${options.packageManager} build

# Run tests
${options.packageManager} test
\`\`\`

## Project Structure

\`\`\`
.
├── apps/           # Micro Frontend applications
├── packages/       # Shared packages
├── tools/          # Build tools and scripts
└── mfeforge.config.ts  # MFE Forge configuration
\`\`\`

## Documentation

- [MFE Forge Docs](https://mfe-forge.dev)
`);

      spinner.succeed('Project structure created');

      if (!options.skipGit) {
        spinner.start('Initializing git repository...');
        await execa('git', ['init'], { cwd: targetDir });
        await fs.writeFile(path.join(targetDir, '.gitattributes'), '* text=auto eol=lf\n');
        spinner.succeed('Git repository initialized');
      }

      if (!options.skipInstall) {
        spinner.start(`Installing dependencies with ${options.packageManager}...`);
        await execa(options.packageManager, ['install'], { 
          cwd: targetDir,
          stdio: 'pipe'
        });
        spinner.succeed('Dependencies installed');
      }

      console.log(chalk.green('\n✅ Project initialized successfully!'));
      console.log(chalk.cyan(`\nNext steps:`));
      console.log(`  cd ${name}`);
      console.log(`  ${options.packageManager} mfe generate app dashboard`);
      console.log(`  ${options.packageManager} dev\n`);

    } catch (error: any) {
      spinner.fail('Initialization failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });
