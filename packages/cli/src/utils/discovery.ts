import fs from 'fs-extra';
import path from 'path';
import { toCamelCase, toPascalCase, getPackageName } from './files.js';
import type { ProjectContext, RemoteApp } from '../types/index.js';

export function discoverApps(context: ProjectContext): RemoteApp[] {
  const apps: RemoteApp[] = [];
  const { appsDir, config } = context;

  if (!fs.existsSync(appsDir)) return apps;

  const scanScope = (scopeDir: string, scopeName: string) => {
    const entries = fs.readdirSync(scopeDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'node_modules') continue;

      const appDir = path.join(scopeDir, entry.name);
      const viteConfig = path.join(appDir, 'vite.config.ts');

      if (fs.existsSync(viteConfig)) {
        const name = entry.name;
        const fullName = `${scopeName}/${name}`;
        const camelName = toCamelCase(fullName);
        const pascalName = toPascalCase(fullName);

        // Extract port
        let port = 3000;
        const content = fs.readFileSync(viteConfig, 'utf-8');
        const match = content.match(/port:\s*(\d+)/);
        if (match) port = parseInt(match[1]);

        apps.push({
          name: fullName,
          scope: scopeName,
          port,
          url: `http://localhost:${port}/assets/remoteEntry.js`,
          camelName: `${camelName}App`,
          pascalName: `${pascalName}App`,
          packageName: getPackageName(fullName.replace(/\//g, '-'), config.organization),
          entry: `./src/bootstrap.tsx`
        });
      }
    }
  };

  // Scan scoped directories
  const entries = fs.readdirSync(appsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const scopeDir = path.join(appsDir, entry.name);
    const hasApps = fs.readdirSync(scopeDir, { withFileTypes: true })
      .some(e => e.isDirectory() && fs.existsSync(path.join(scopeDir, e.name, 'vite.config.ts')));

    if (hasApps) {
      scanScope(scopeDir, entry.name);
    }
  }

  return apps;
}

export function discoverHosts(context: ProjectContext): string[] {
  const hosts: string[] = [];
  const { appsDir } = context;

  if (!fs.existsSync(appsDir)) return hosts;

  const entries = fs.readdirSync(appsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const scopeDir = path.join(appsDir, entry.name);
    const hostDir = path.join(scopeDir, 'host');

    if (fs.existsSync(path.join(hostDir, 'vite.config.ts'))) {
      hosts.push(`${entry.name}/host`);
    }
  }

  return hosts;
}
