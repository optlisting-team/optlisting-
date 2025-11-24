import Sidebar from './Sidebar'
import PageHeader from './PageHeader'
import Dashboard from './Dashboard'

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Header */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

