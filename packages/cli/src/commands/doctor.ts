import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { getProjectContext } from '../utils/config.js';
import { discoverApps } from '../utils/discovery.js';

export const doctorCommand = new Command('doctor')
  .description('Diagnose common issues in the MFE project')
  .action(async () => {
    const context = getProjectContext();
    const issues: string[] = [];
    const checks: string[] = [];

    console.log(chalk.cyan('🔍 Running diagnostics...\n'));

    // Check 1: Node version
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (major < 20) {
      issues.push(`Node version ${nodeVersion} is too old. Requires >= 20.0.0`);
    } else {
      checks.push(`Node version: ${nodeVersion} ✅`);
    }

    // Check 2: Package manager
    const pm = context.config.defaults.packageManager;
    try {
      await fs.access(path.join(context.rootDir, pm === 'pnpm' ? 'pnpm-lock.yaml' : pm === 'bun' ? 'bun.lock' : 'package-lock.json'));
      checks.push(`Lock file present for ${pm} ✅`);
    } catch {
      issues.push(`No lock file found for ${pm}. Run ${pm} install`);
    }

    // Check 3: Port conflicts
    const apps = discoverApps(context);
    const ports = new Map<number, string>();
    for (const app of apps) {
      if (ports.has(app.port)) {
        issues.push(`Port conflict: ${app.name} and ${ports.get(app.port)} both use port ${app.port}`);
      } else {
        ports.set(app.port, app.name);
      }
    }
    if (ports.size === apps.length) {
      checks.push('No port conflicts ✅');
    }

    // Check 4: Host coverage
    const scopes = new Set(apps.map(a => a.scope));
    for (const scope of scopes) {
      const hostPath = path.join(context.appsDir, scope, 'host');
      if (!await fs.pathExists(hostPath)) {
        issues.push(`Scope "${scope}" is missing a host application`);
      }
    }
    if (scopes.size > 0) {
      checks.push('All scopes have hosts ✅');
    }

    // Check 5: Shared dependencies
    const rootPkgPath = path.join(context.rootDir, 'package.json');
    if (await fs.pathExists(rootPkgPath)) {
      const rootPkg = await fs.readJson(rootPkgPath);
      const hasWorkspaces = rootPkg.workspaces || rootPkg.bun?.workspaces;
      if (!hasWorkspaces) {
        issues.push('Root package.json missing workspaces configuration');
      } else {
        checks.push('Workspaces configured ✅');
      }
    }

    // Report
    console.log(chalk.bold('Checks:'));
    for (const check of checks) {
      console.log(`  ${check}`);
    }

    if (issues.length > 0) {
      console.log(chalk.red(`\nIssues found (${issues.length}):`));
      for (const issue of issues) {
        console.log(`  ❌ ${issue}`);
      }
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ All checks passed'));
    }
  });
