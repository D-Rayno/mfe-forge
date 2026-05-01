import React, { useEffect, useState, type ComponentType } from 'react';
import { useNavigate, useLocation, Route } from 'react-router-dom';

export interface MFERoute {
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  children?: MFERoute[];
  lazy?: () => Promise<{ default: ComponentType<any> }>;
}

export interface RouteRegistry {
  [scope: string]: MFERoute[];
}

// Hook for cross-MFE navigation
export function useMFENavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    navigateTo: (scope: string, path: string = '/') => {
      const targetPath = `/${scope}${path}`;
      navigate(targetPath);
    },
    getCurrentScope: () => {
      const parts = location.pathname.split('/').filter(Boolean);
      return parts[0] || 'host';
    },
    getCurrentPath: () => location.pathname,
    location
  };
}

// Hook to sync route changes with event bus
export function useRouteSync(eventBus?: { emit: (event: string, payload: any) => void }) {
  const location = useLocation();

  useEffect(() => {
    if (eventBus) {
      eventBus.emit('route:changed', {
        path: location.pathname,
        search: location.search,
        hash: location.hash
      });
    }
  }, [location, eventBus]);
}

// Generate routes from registry
export function generateRoutes(registry: RouteRegistry): React.JSX.Element[] {
  const routes: React.JSX.Element[] = [];

  for (const [scope, scopeRoutes] of Object.entries(registry)) {
    for (const route of scopeRoutes) {
      const Component = route.component;
      routes.push(
        <Route
          key={`${scope}-${route.path}`}
          path={`/${scope}${route.path}`}
          element={<Component />}
        />
      );
    }
  }

  return routes;
}

// Route guard for auth/permissions
export function createRouteGuard(
  predicate: () => boolean | Promise<boolean>,
  fallback: ComponentType<any>
) {
  const Fallback = fallback;
  return function GuardedRoute({ children }: { children: React.ReactNode }) {
    const [allowed, setAllowed] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      Promise.resolve(predicate()).then(result => {
        setAllowed(result);
        setChecking(false);
      });
    }, []);

    if (checking) return null;
    if (!allowed) return <Fallback />;
    return children;
  };
}
