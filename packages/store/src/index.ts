import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Global shared store for cross-MFE state
interface GlobalState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    roles: string[];
  } | null;
  theme: 'light' | 'dark' | 'system';
  locale: string;
  features: Record<string, boolean>;
  setUser: (user: GlobalState['user']) => void;
  setTheme: (theme: GlobalState['theme']) => void;
  setLocale: (locale: string) => void;
  toggleFeature: (key: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  subscribeWithSelector((set) => ({
    user: null,
    theme: 'system',
    locale: 'en',
    features: {},
    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),
    setLocale: (locale) => set({ locale }),
    toggleFeature: (key) =>
      set((state) => ({
        features: { ...state.features, [key]: !state.features[key] }
      }))
  }))
);

// Scoped store factory for MFE-specific state
export function createScopedStore<T extends object>(
  scope: string,
  initialState: T
) {
  return create<T & { reset: () => void }>()(
    subscribeWithSelector((set) => ({
      ...initialState,
      reset: () => set(initialState)
    }))
  );
}

// Store sync utility
export function syncStoreAcrossMFEs<T>(
  store: { subscribe: (selector: (state: T) => any, callback: (state: any) => void) => () => void },
  eventBus: { emit: (event: string, payload: any) => void },
  eventPrefix: string
) {
  return store.subscribe(
    (state: T) => state,
    (state: any) => {
      eventBus.emit(`${eventPrefix}:sync`, state);
    }
  );
}
