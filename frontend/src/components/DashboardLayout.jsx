import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed inset-y-0 z-50">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

