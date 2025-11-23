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
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1a1f36] text-slate-200 flex flex-col z-50">
      {/* Top: Logo */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">OptListing</span>
        </Link>
      </div>

      {/* Middle: Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-blue-600/20 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: Tools & User Info */}
      <div className="px-4 py-6 border-t border-slate-700/50 space-y-4">
        {/* Store Switcher */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Store className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Store</span>
          </div>
          <div className="px-2">
            <StoreSwitcher currentStore={selectedStore} onStoreChange={setSelectedStore} />
          </div>
        </div>

        {/* Plan Badge */}
        <Link
          to="/billing"
          className="block px-4 py-2 bg-slate-800/50 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors border border-slate-700/50"
        >
          {formatStoreUtilization()}
        </Link>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-400">API Connected</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

