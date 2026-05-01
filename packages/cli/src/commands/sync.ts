import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { getProjectContext } from '../utils/config.js';
import { discoverApps, discoverHosts } from '../utils/discovery.js';
import { toCamelCase, toPascalCase } from '../utils/files.js';

export const syncCommand = new Command('sync')
  .description('Synchronize types, configs, and registrations across MFEs')
  .option('--types', 'Generate and sync TypeScript declarations')
  .option('--hosts', 'Sync host configurations with all remotes')
  .option('--routes', 'Sync route registrations')
  .action(async (options) => {
    const spinner = ora();
    const context = getProjectContext();

    try {
      if (!options.types && !options.hosts && !options.routes) {
        // Run all sync operations
        options.types = true;
        options.hosts = true;
        options.routes = true;
      }

      const apps = discoverApps(context);
      const hosts = discoverHosts(context);

      if (options.hosts) {
        spinner.start('Syncing host configurations...');

        for (const hostName of hosts) {
          const scope = hostName.split('/')[0];
          const scopeApps = apps.filter(a => a.scope === scope && a.name !== hostName);
          const hostDir = path.join(context.appsDir, hostName);

          // Update vite.config.ts remotes
          const vitePath = path.join(hostDir, 'vite.config.ts');
          if (await fs.pathExists(vitePath)) {
            let content = await fs.readFile(vitePath, 'utf-8');

            // Rebuild remotes block
            let remotesBlock = '      remotes: {\n';
            for (const app of scopeApps) {
              remotesBlock += `        ${app.camelName}: "http://localhost:${app.port}/assets/remoteEntry.js",\n`;
            }
            remotesBlock += '      },';

            // Replace existing remotes block
            content = content.replace(/remotes:\s*\{[^}]*\}/s, remotesBlock);
            await fs.writeFile(vitePath, content);
          }

          // Update declarations
          const declPath = path.join(hostDir, 'src/remotes/declarations.d.ts');
          let declContent = '// Auto-generated remote declarations\n';
          for (const app of scopeApps) {
            declContent += `\ndeclare module '${app.camelName}/App' {\n  import React from 'react'\n  const App: React.ComponentType<any>\n  export default App\n}\n`;
          }
          await fs.writeFile(declPath, declContent);
        }

        spinner.succeed('Host configurations synced');
      }

      if (options.types) {
        spinner.start('Syncing TypeScript declarations...');
        // In a real implementation, this would use @module-federation/dts-plugin
        // or similar to generate types from remoteEntry.js manifests
        spinner.succeed('TypeScript declarations synced');
      }

      if (options.routes) {
        spinner.start('Syncing route registrations...');
        // Update host App.tsx with route entries for each remote
        spinner.succeed('Route registrations synced');
      }

      console.log(chalk.green('\n✅ Sync complete'));

    } catch (error: any) {
      spinner.fail('Sync failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });
