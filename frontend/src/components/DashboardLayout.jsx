import { Suspense } from 'react'
import Sidebar from './Sidebar'
import PageHeader from './PageHeader'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar - Always visible immediately, prevents FOUC */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Header - Always visible immediately */}
        <PageHeader />
        
        {/* Main Content - Suspense wrapped for smooth loading */}
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={
            <div className="p-6">
              <div className="space-y-6">
                {/* Summary Card Skeleton */}
                <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
                {/* Table Skeleton */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-64 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
