import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import Mustache from 'mustache'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Set of file extensions that should be treated as text and rendered through Mustache. */
const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.html',
  '.css',
  '.scss',
  '.yml',
  '.yaml',
  '.md',
  '.txt',
  '.env',
  '.toml',
  '.cfg',
  '.conf',
  '.mustache',
  '.gitignore',
  '.npmrc',
  '.prettierrc',
  '.eslintrc',
])

/**
 * Determines whether a file should be treated as a text template.
 * Binary files (images, fonts, etc.) are copied verbatim.
 */
function isTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase()
  // Files with no extension (e.g. Dockerfile, .gitignore) are treated as text
  if (!ext) return true
  return TEXT_EXTENSIONS.has(ext)
}

/**
 * Copies a template directory to the target, rendering Mustache placeholders
 * in all text files. Binary files are copied verbatim.
 *
 * @param templateName - Name of the template directory (e.g. 'app', 'host', 'package')
 * @param targetDir - Absolute path to the destination directory
 * @param variables - Key-value pairs to substitute in Mustache templates
 */
export async function copyTemplate(
  templateName: string,
  targetDir: string,
  variables: Record<string, any>
) {
  const templateDir = path.resolve(__dirname, '../../src/templates', templateName)

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template "${templateName}" not found at ${templateDir}`)
  }

  await fs.ensureDir(targetDir)

  const files = await fs.readdir(templateDir, { recursive: true })

  for (const file of files) {
    const filePath = typeof file === 'string' ? file : file.toString()
    const srcPath = path.join(templateDir, filePath)
    const stat = await fs.stat(srcPath)

    if (stat.isDirectory()) continue

    // Strip .mustache extension from output filename if present
    const outputFile = filePath.endsWith('.mustache')
      ? filePath.replace(/\.mustache$/, '')
      : filePath
    const destPath = path.join(targetDir, outputFile)
    await fs.ensureDir(path.dirname(destPath))

    if (isTextFile(filePath)) {
      // Render all text files through Mustache for placeholder substitution
      const content = await fs.readFile(srcPath, 'utf-8')
      const rendered = Mustache.render(content, variables)
      await fs.writeFile(destPath, rendered)
    } else {
      // Copy binary files (images, fonts, etc.) verbatim
      await fs.copy(srcPath, destPath)
    }
  }
}

/**
 * Reads a JSON file, applies an updater function, and writes it back.
 *
 * @param filePath - Absolute path to the JSON file
 * @param updater - Callback that mutates the parsed JSON object in-place
 */
export async function updateJson(filePath: string, updater: (json: any) => void) {
  const json = await fs.readJson(filePath)
  updater(json)
  await fs.writeJson(filePath, json, { spaces: 2 })
}

/**
 * Appends content to a file, creating it if it doesn't exist.
 *
 * @param filePath - Absolute path to the target file
 * @param content - String content to append
 */
export async function appendToFile(filePath: string, content: string) {
  await fs.ensureFile(filePath)
  await fs.appendFile(filePath, content)
}

/**
 * Injects content into a file at a specific marker position.
 * Useful for adding federation remotes or route entries to existing config files.
 *
 * @param filePath - Absolute path to the file to modify
 * @param marker - String marker to search for in the file
 * @param content - Content to inject at the marker position
 * @param position - Whether to inject 'before' or 'after' the marker (default: 'after')
 */
export async function injectIntoFile(
  filePath: string,
  marker: string,
  content: string,
  position: 'before' | 'after' = 'after'
) {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const index = fileContent.indexOf(marker)

  if (index === -1) {
    console.warn(chalk.yellow(`Marker "${marker}" not found in ${filePath}`))
    return
  }

  const insertIndex = position === 'after' ? index + marker.length : index
  const newContent = fileContent.slice(0, insertIndex) + content + fileContent.slice(insertIndex)

  await fs.writeFile(filePath, newContent)
}

/**
 * Converts a string to PascalCase.
 * @example toPascalCase('checkout/cart') // 'CheckoutCart'
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_/](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase())
}

/**
 * Converts a string to camelCase.
 * @example toCamelCase('checkout/cart') // 'checkoutCart'
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Converts a string to kebab-case.
 * @example toKebabCase('CheckoutCart') // 'checkout-cart'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_/]/g, '-')
    .toLowerCase()
}

/**
 * Generates a valid npm package name, optionally scoped to an organization.
 * @param name - Base name (slashes are replaced with hyphens)
 * @param org - Optional npm organization (e.g., 'acme' becomes '@acme/name')
 * @returns Formatted package name (e.g., '@acme/checkout-cart')
 */
export function getPackageName(name: string, org?: string): string {
  const cleanName = name.replace(/\//g, '-')
  return org ? `@${org}/${cleanName}` : cleanName
}
