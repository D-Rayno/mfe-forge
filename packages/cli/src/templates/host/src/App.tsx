import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MFErrorBoundary } from '@mfe-forge/core'
import { AppLayout } from './layouts/AppLayout'

// Lazy load remote apps
// Example: const DashboardApp = React.lazy(() => import('dashboardApp/App'))

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MFErrorBoundary>
        <AppLayout>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading application...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <div className="p-8 text-center text-xl">
                  <h1 className="text-3xl font-bold mb-4">{{pascalName}} Host</h1>
                  <p className="text-muted-foreground">
                    Add your remote routes here
                  </p>
                </div>
              } />
              {/* Add remote routes here */}
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-muted-foreground">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </AppLayout>
      </MFErrorBoundary>
    </div>
  )
}
