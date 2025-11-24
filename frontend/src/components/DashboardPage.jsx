import { Suspense, lazy } from 'react'
import DashboardLayout from './DashboardLayout'

const Dashboard = lazy(() => import('./Dashboard'))

function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="p-6">
          <div className="space-y-4">
            <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
            <div className="h-96 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
          </div>
        </div>
      }>
        <Dashboard />
      </Suspense>
    </DashboardLayout>
  )
}

export default DashboardPage

