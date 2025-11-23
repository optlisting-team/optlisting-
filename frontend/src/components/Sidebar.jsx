import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, List, History, Settings, Store } from 'lucide-react'
import { useStore } from '../contexts/StoreContext'
import StoreSwitcher, { getConnectedStoreCount } from './StoreSwitcher'

function Sidebar() {
  const location = useLocation()
  const { selectedStore, setSelectedStore } = useStore()
  const [currentPlan] = useState("PRO")
  const connectedStoreCount = getConnectedStoreCount()

  // Get max store limit based on plan
  const getMaxStoreLimit = (plan) => {
    switch (plan) {
      case "Starter":
        return 1
      case "PRO":
        return 10
      case "MASTER":
        return 25
      case "Enterprise":
        return Infinity
      default:
        return 10
    }
  }

  const maxStoreLimit = getMaxStoreLimit(currentPlan)

  const formatStoreUtilization = () => {
    if (maxStoreLimit === Infinity) {
      return `💎 ${currentPlan}: ${connectedStoreCount} / ∞ Stores`
    }
    return `💎 ${currentPlan}: ${connectedStoreCount} / ${maxStoreLimit} Stores`
  }

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/listings', icon: List, label: 'Listings' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col z-50">
      {/* Top: Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">OptListing</span>
        </Link>
      </div>

      {/* Middle: Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    active
                      ? 'bg-gray-800 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: Tools & User Info */}
      <div className="px-4 py-6 border-t border-gray-800 space-y-3">
        {/* Store Switcher */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Store className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Store</span>
          </div>
          <div className="px-2">
            <StoreSwitcher currentStore={selectedStore} onStoreChange={setSelectedStore} isInSidebar={true} />
          </div>
        </div>

        {/* Plan Badge */}
        <Link
          to="/billing"
          className="block px-3 py-2 bg-gray-800 rounded-md text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {formatStoreUtilization()}
        </Link>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-300">API Connected</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

