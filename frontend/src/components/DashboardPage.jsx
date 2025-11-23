import { useState } from 'react'
import Navbar from './Navbar'
import PageHeader from './PageHeader'
import Dashboard from './Dashboard'

// Default store (eBay Main Store)
const DEFAULT_STORE = { id: 'store_ebay_1', name: 'eBay Main Store', platform: 'eBay', color: 'bg-purple-100 text-purple-700' }

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

