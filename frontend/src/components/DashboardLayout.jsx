import Sidebar from './Sidebar'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen bg-slate-50 p-8">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

