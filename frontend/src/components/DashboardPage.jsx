import Navbar from './Navbar'
import PageHeader from './PageHeader'
import Dashboard from './Dashboard'

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Spacing for fixed navbar */}
      <div className="pt-16">
        {/* Page Header */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="py-8">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

