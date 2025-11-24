import Sidebar from './Sidebar'
import PageHeader from './PageHeader'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black dark:bg-black font-sans">
      {/* Sidebar - Always visible immediately, prevents FOUC */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-black dark:bg-black">
        {/* Page Header - Always visible immediately */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-black dark:bg-black">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
