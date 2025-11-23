import { useState } from 'react'
import Navbar from './Navbar'
import PageHeader from './PageHeader'
import Dashboard from './Dashboard'

// Default store (All Stores - aggregated view)
const DEFAULT_STORE = { id: 'all', name: '🌍 All Stores', platform: 'Global', color: 'bg-gray-100 text-gray-800' }

function DashboardPage() {
  const [selectedStore, setSelectedStore] = useState(DEFAULT_STORE)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Navbar */}
      <Navbar currentStore={selectedStore} onStoreChange={setSelectedStore} />
      
      {/* Spacing for fixed navbar */}
      <div className="pt-16">
        {/* Page Header */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="py-8">
          <Dashboard selectedStore={selectedStore} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

