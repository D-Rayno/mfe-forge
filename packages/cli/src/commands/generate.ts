import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { getProjectContext } from '../utils/config.js';
import { findAvailablePort } from '../utils/port.js';
import { discoverApps } from '../utils/discovery.js';
import { copyTemplate, updateJson, toPascalCase, toCamelCase, getPackageName, injectIntoFile } from '../utils/files.js';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Generate apps, hosts, packages, or design systems')
  .argument('<type>', 'Type to generate: app, host, package, design-system, library')
  .argument('[name]', 'Name of the item (use \"scope/name\" for scoped apps)')
  .option('--port <port>', 'Development server port')
  .option('--host <host>', 'Target host for app registration')
  .option('--scope <scope>', 'Scope/team for the app')
  .option('--features <features>', 'Comma-separated features', '')
  .option('--skip-host', 'Skip host auto-generation')
  .action(async (type, name, options) => {
    const spinner = ora();
    const context = getProjectContext();

    try {
      const validTypes = ['app', 'host', 'package', 'design-system', 'library', 'pkg'];
      if (!validTypes.includes(type)) {
        console.error(chalk.red(`Invalid type "${type}". Valid: ${validTypes.join(', ')}`));
        process.exit(1);
      }

      if (type === 'pkg') type = 'package';

      if (!name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: `${toPascalCase(type)} name:`,
            validate: (input) => /^[a-z][a-z0-9-/]*$/.test(input) || 'Use lowercase, numbers, hyphens, slashes'
          }
        ]);
        name = answers.name;
      }

      const cleanName = name.toLowerCase().replace(/^@\w+\//, '');
      const hasScope = cleanName.includes('/');
      const scope = hasScope ? cleanName.split('/')[0] : (options.scope || 'default');
      const appName = hasScope ? cleanName.split('/')[1] : cleanName;
      const fullName = hasScope ? cleanName : `${scope}/${cleanName}`;

      let targetDir: string;
      if (type === 'package' || type === 'library') {
        targetDir = path.join(context.packagesDir, cleanName.replace(/\//g, '-'));
      } else {
        targetDir = path.join(context.appsDir, fullName);
      }

      if (await fs.pathExists(targetDir)) {
        console.error(chalk.red(`Directory already exists: ${targetDir}`));
        process.exit(1);
      }

      spinner.start(`Generating ${type} "${fullName}"...`);
      await fs.ensureDir(targetDir);

      let port: number | undefined;
      if (type === 'app' || type === 'host') {
        port = options.port ? parseInt(options.port) : await findAvailablePort(context);
      }

      const vars = {
        name: appName,
        scope,
        fullName,
        pascalName: toPascalCase(appName),
        camelName: toCamelCase(appName),
        packageName: getPackageName(fullName.replace(/\//g, '-'), context.config.organization),
        port,
        host: options.host || `${scope}/host`,
        organization: context.config.organization || 'mfe-forge',
        features: options.features ? options.features.split(',') : [],
        hasScope,
        depth: hasScope ? '../../..' : '../../..'
      };

      const templateName = type === 'design-system' ? 'design-system' : type;
      await copyTemplate(templateName, targetDir, vars);

      if (type === 'app') {
        await postGenerateApp(context, vars, targetDir, options);
      } else if (type === 'host') {
        await postGenerateHost(context, vars, targetDir);
      }

      const rootPkgPath = path.join(context.rootDir, 'package.json');
      if (await fs.pathExists(rootPkgPath)) {
        await updateJson(rootPkgPath, (pkg) => {
          const scriptKey = `dev:${fullName.replace(/\//g, ':')}`;
          pkg.scripts = pkg.scripts || {};
          if (!pkg.scripts[scriptKey]) {
            pkg.scripts[scriptKey] = `${context.config.defaults.packageManager} --filter ${vars.packageName} dev`;
          }
        });
      }

      spinner.succeed(`${toPascalCase(type)} "${fullName}" generated successfully`);

      console.log(chalk.cyan('\nNext steps:'));
      console.log(`  ${context.config.defaults.packageManager} install`);
      console.log(`  ${context.config.defaults.packageManager} run dev:${fullName.replace(/\//g, ':')}`);

    } catch (error: any) {
      spinner.fail('Generation failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

async function postGenerateApp(context: any, vars: any, targetDir: string, options: any) {
  const { scope, fullName, camelName, port, host } = vars;

  if (!options.skipHost && host) {
    const hostDir = path.join(context.appsDir, host);
    if (!await fs.pathExists(hostDir)) {
      console.log(chalk.yellow(`Host "${host}" not found. Generating...`));
      await fs.ensureDir(hostDir);
    }

    await registerInHost(context, fullName, camelName, port, host);
  }
}

async function postGenerateHost(context: any, vars: any, targetDir: string) {
  const apps = discoverApps(context).filter(a => a.scope === vars.scope && a.name !== vars.fullName);

  const viteConfigPath = path.join(targetDir, 'vite.config.ts');
  const declarationsPath = path.join(targetDir, 'src/remotes/declarations.d.ts');

  if (apps.length > 0 && await fs.pathExists(viteConfigPath)) {
    let remotesConfig = '';
    let declarations = '// Auto-generated remote declarations\n';

    for (const app of apps) {
      remotesConfig += `        ${app.camelName}: "http://localhost:${app.port}/assets/remoteEntry.js",\n`;
      declarations += `declare module '${app.camelName}/App' {\n  import React from 'react'\n  const App: React.ComponentType<any>\n  export default App\n}\n\n`;
    }

    const content = await fs.readFile(viteConfigPath, 'utf-8');
    if (content.includes('remotes: {')) {
      const newContent = content.replace(
        /remotes:\s*\{[^}]*\}/s,
        `remotes: {\n${remotesConfig}      }`
      );
      await fs.writeFile(viteConfigPath, newContent);
    }

    await fs.writeFile(declarationsPath, declarations);
  }
}

async function registerInHost(context: any, appName: string, appCamel: string, port: number, hostName: string) {
  const hostDir = path.join(context.appsDir, hostName);
  const viteConfig = path.join(hostDir, 'vite.config.ts');
  const declarations = path.join(hostDir, 'src/remotes/declarations.d.ts');

  if (await fs.pathExists(viteConfig)) {
    const remoteEntry = `        ${appCamel}App: "http://localhost:${port}/assets/remoteEntry.js",`;
    await injectIntoFile(viteConfig, 'remotes: {', `\n${remoteEntry}`, 'after');
  }

  if (await fs.pathExists(declarations)) {
    const decl = `\ndeclare module '${appCamel}App/App' {\n  import React from 'react'\n  const App: React.ComponentType<any>\n  export default App\n}\n`;
    await fs.appendFile(declarations, decl);
  }
}
