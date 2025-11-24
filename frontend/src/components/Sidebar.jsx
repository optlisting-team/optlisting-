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
    <div className="flex flex-col h-screen bg-zinc-900 border-r border-zinc-800 w-64">
      {/* Top Section - Header */}
      <div className="px-4 py-6 border-b border-zinc-800">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">OptListing</span>
        </Link>

        {/* Store Switcher */}
        <div className="mb-4">
          <StoreSwitcher />
        </div>

        {/* API Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-xs font-medium text-zinc-300">API Connected</span>
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
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
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
      <div className="px-4 py-4 border-t border-zinc-800">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-zinc-400 truncate">user@example.com</p>
          </div>
        </div>

        {/* Plan Badge */}
        <div className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">PLAN:</span>
            <span className="text-xs font-bold text-white">PRO</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
