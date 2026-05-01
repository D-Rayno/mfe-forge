import { Routes, Route, Navigate } from 'react-router-dom'
import { MFErrorBoundary } from '@mfe-forge/core'

export default function {{pascalName}}App() {
  return (
    <MFErrorBoundary remoteName="{{fullName}}">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="rounded-2xl border border-border bg-card p-8 text-center backdrop-blur-xl">
                <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                  {{pascalName}} App
                </h1>
                <p className="text-muted-foreground">
                  Micro Frontend running on port {{port}}
                </p>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/{{fullName}}" replace />} />
      </Routes>
    </MFErrorBoundary>
  )
}
