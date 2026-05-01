import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Mustache from 'mustache';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function copyTemplate(
  templateName: string,
  targetDir: string,
  variables: Record<string, any>
) {
  const templateDir = path.resolve(__dirname, '../../templates', templateName);

  if (!await fs.pathExists(templateDir)) {
    throw new Error(`Template "${templateName}" not found at ${templateDir}`);
  }

  await fs.ensureDir(targetDir);

  const files = await fs.readdir(templateDir, { recursive: true });

  for (const file of files) {
    const srcPath = path.join(templateDir, file);
    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) continue;

    const destPath = path.join(targetDir, file);
    await fs.ensureDir(path.dirname(destPath));

    const content = await fs.readFile(srcPath, 'utf-8');

    // Check if file should be processed as template
    if (file.endsWith('.mustache')) {
      const rendered = Mustache.render(content, variables);
      const finalPath = destPath.replace('.mustache', '');
      await fs.writeFile(finalPath, rendered);
    } else {
      await fs.copy(srcPath, destPath);
    }
  }
}

export async function updateJson(filePath: string, updater: (json: any) => void) {
  const json = await fs.readJson(filePath);
  updater(json);
  await fs.writeJson(filePath, json, { spaces: 2 });
}

export async function appendToFile(filePath: string, content: string) {
  await fs.ensureFile(filePath);
  await fs.appendFile(filePath, content);
}

export async function injectIntoFile(
  filePath: string,
  marker: string,
  content: string,
  position: 'before' | 'after' = 'after'
) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const index = fileContent.indexOf(marker);

  if (index === -1) {
    console.warn(chalk.yellow(`Marker "${marker}" not found in ${filePath}`));
    return;
  }

  const insertIndex = position === 'after' ? index + marker.length : index;
  const newContent = fileContent.slice(0, insertIndex) + content + fileContent.slice(insertIndex);

  await fs.writeFile(filePath, newContent);
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_/](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_/]/g, '-')
    .toLowerCase();
}

export function getPackageName(name: string, org?: string): string {
  const cleanName = name.replace(/\//g, '-');
  return org ? `@${org}/${cleanName}` : cleanName;
}
