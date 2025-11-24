import { Suspense } from 'react'
import Sidebar from './Sidebar'
import PageHeader from './PageHeader'

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="h-full animate-pulse">
          <div className="px-4 py-6 border-b border-slate-200">
            <div className="h-8 bg-slate-200 rounded mb-4"></div>
            <div className="h-10 bg-slate-200 rounded mb-4"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 py-6 px-6">
          <div className="h-10 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
            <div className="h-96 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
export { DashboardSkeleton }
