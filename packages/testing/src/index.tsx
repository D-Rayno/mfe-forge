import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// Wrapper that provides common providers for MFE testing
interface MFERenderOptions extends RenderOptions {
  route?: string;
  initialState?: Record<string, any>;
}

export function renderMFE(
  ui: React.ReactElement,
  options: MFERenderOptions = {}
): RenderResult {
  const { route = '/', initialState, ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <React.StrictMode>
        {children}
      </React.StrictMode>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock for remote modules in tests
export function mockRemoteModule(moduleName: string, component: React.ComponentType<any>) {
  vi.mock(moduleName, () => ({
    default: component
  }));
}

// Utility to wait for federated modules to load
export async function waitForRemoteLoad(
  callback: () => boolean,
  timeout = 5000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (callback()) return;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Remote module load timeout');
}

// E2E helpers for cross-MFE testing
export const e2eHelpers = {
  // Navigate to a specific MFE route
  navigateToMFE: async (page: any, scope: string, path: string = '/') => {
    await page.goto(`/${scope}${path}`);
    await page.waitForSelector(`[data-mfe-scope="${scope}"]`, { timeout: 10000 });
  },

  // Wait for remote to be visible
  waitForRemote: async (page: any, remoteName: string) => {
    await page.waitForSelector(`[data-remote-name="${remoteName}"]`, { timeout: 10000 });
  },

  // Check if MFE rendered without errors
  assertMFERendered: async (page: any, scope: string) => {
    const errorBoundary = await page.$('[data-testid="mfe-error"]');
    if (errorBoundary) {
      throw new Error(`MFE "${scope}" rendered with errors`);
    }
  }
};
