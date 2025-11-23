import PageHeader from './PageHeader'
import Dashboard from './Dashboard'

function DashboardPage() {
  return (
    <div className="font-sans">
      {/* Page Header */}
      <PageHeader />
      
      {/* Main Content */}
      <Dashboard />
    </div>
  )
}

export default DashboardPage

