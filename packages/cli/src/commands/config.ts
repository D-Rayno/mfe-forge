import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { getProjectContext, saveConfig } from '../utils/config.js';

export const configCommand = new Command('config')
  .description('Manage MFE Forge configuration')
  .option('--get <key>', 'Get config value')
  .option('--set <key>', 'Set config value')
  .option('--value <value>', 'Value to set')
  .option('--edit', 'Open config in editor')
  .action(async (options) => {
    const context = getProjectContext();
    const configPath = path.join(context.rootDir, 'mfeforge.config.ts');

    if (options.get) {
      const keys = options.get.split('.');
      let value: any = context.config;
      for (const key of keys) {
        value = value?.[key];
      }
      console.log(value !== undefined ? value : chalk.gray('undefined'));
      return;
    }

    if (options.set) {
      if (!options.value) {
        console.error(chalk.red('--value is required with --set'));
        process.exit(1);
      }
      // Simple implementation - in reality would need deep merge
      console.log(chalk.yellow('Use --edit to modify config manually'));
      return;
    }

    if (options.edit) {
      const { default: open } = await import('open');
      await open(configPath);
      return;
    }

    // Interactive config
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: 'Default package manager:',
        choices: ['bun', 'pnpm', 'npm'],
        default: context.config.defaults.packageManager
      },
      {
        type: 'confirm',
        name: 'autoStartHost',
        message: 'Auto-start host with apps?',
        default: context.config.dev.autoStartHost
      }
    ]);

    const newConfig = {
      ...context.config,
      defaults: { ...context.config.defaults, ...answers },
      dev: { ...context.config.dev, autoStartHost: answers.autoStartHost }
    };

    await saveConfig(newConfig, context.rootDir);
    console.log(chalk.green('Configuration updated'));
  });
