import portfinder from 'portfinder';
import fs from 'fs-extra';
import path from 'path';
import type { ProjectContext } from '../types/index.js';

export async function findAvailablePort(
  context: ProjectContext,
  preferredPort?: number
): Promise<number> {
  const [start, end] = context.config.dev.portRange;
  portfinder.setBasePort(preferredPort || start);
  portfinder.setHighestPort(end);

  return portfinder.getPortPromise();
}

export function getUsedPorts(appsDir: string): Set<number> {
  const used = new Set<number>();

  if (!fs.existsSync(appsDir)) return used;

  const scanDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        const viteConfig = path.join(fullPath, 'vite.config.ts');
        const pkgJson = path.join(fullPath, 'package.json');

        if (fs.existsSync(viteConfig)) {
          const content = fs.readFileSync(viteConfig, 'utf-8');
          const match = content.match(/port:\s*(\d+)/);
          if (match) used.add(parseInt(match[1]));
        }

        if (fs.existsSync(pkgJson)) {
          const pkg = fs.readJsonSync(pkgJson);
          const devScript = pkg.scripts?.dev || '';
          const match = devScript.match(/--port\s+(\d+)/);
          if (match) used.add(parseInt(match[1]));
        }

        // Recurse if it might be a scope directory
        if (entry.isDirectory() && !fs.existsSync(viteConfig)) {
          scanDir(fullPath);
        }
      }
    }
  };

  scanDir(appsDir);
  return used;
}
