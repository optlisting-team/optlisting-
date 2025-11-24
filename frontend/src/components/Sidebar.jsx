import { Link, useLocation } from 'react-router-dom'
import StoreSwitcher from './StoreSwitcher'
import { LayoutDashboard, List, History, User } from 'lucide-react'

function Sidebar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/listings', label: 'Listings', icon: List },
    { path: '/history', label: 'History', icon: History }
  ]

  return (
    <div className="flex flex-col h-screen bg-white border-r border-slate-200 w-64">
      {/* Top Section - Header */}
      <div className="px-4 py-6 border-b border-slate-200">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-800">OptListing</span>
        </div>

        {/* Store Switcher */}
        <div className="mb-4">
          <StoreSwitcher />
        </div>

        {/* API Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700">API Connected</span>
        </div>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section - Footer */}
      <div className="px-4 py-4 border-t border-slate-200">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">User</p>
            <p className="text-xs text-slate-500 truncate">user@example.com</p>
          </div>
        </div>

        {/* Plan Badge */}
        <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">PLAN:</span>
            <span className="text-xs font-bold text-purple-900">PRO</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
