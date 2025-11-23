import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout

