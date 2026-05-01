import { Link, useLocation } from 'react-router-dom'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    // Add navigation items for remotes
  ]

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h1 className="text-xl font-bold">{{pascalName}}</h1>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
