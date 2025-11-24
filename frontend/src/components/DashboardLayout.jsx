import Sidebar from './Sidebar'
import PageHeader from './PageHeader'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar - Always visible immediately, prevents FOUC */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Header - Always visible immediately */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
