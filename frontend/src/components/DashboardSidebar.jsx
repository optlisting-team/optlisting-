import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, List, History, Settings, Store, Zap, CheckCircle2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "../contexts/StoreContext"
import StoreSwitcher, { getConnectedStoreCount } from "./StoreSwitcher"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Listings", href: "/listings", icon: List },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const location = useLocation()
  const { selectedStore, setSelectedStore } = useStore()
  const connectedStoreCount = getConnectedStoreCount()

  return (
    <aside className="w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-full">
      <div className="h-14 flex items-center px-6 border-b border-border/40">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Zap className="h-4 w-4" />
          </div>
          OptListing
        </Link>
      </div>
      <div className="flex-1 py-4 flex flex-col gap-4">
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href === "/dashboard" && location.pathname === "/dashboard")
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border/40 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-medium uppercase tracking-wider">Store</span>
          </div>
          <div className="px-2">
            <StoreSwitcher currentStore={selectedStore} onStoreChange={setSelectedStore} isInSidebar={true} />
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                PRO Plan
              </span>
              <span className="text-muted-foreground">{connectedStoreCount} / 10 Stores</span>
            </div>
            <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(connectedStoreCount / 10) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium pt-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            API Connected
          </div>
        </div>
      </div>
    </aside>
  )
}

