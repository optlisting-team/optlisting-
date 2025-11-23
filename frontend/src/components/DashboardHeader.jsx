import { Search, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="h-14 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg">Dashboard</h1>
        <span className="text-sm text-muted-foreground hidden md:inline-block">
          Welcome back, CEO. Here is your store health.
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Last synced: just now</span>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-2 bg-background border-border/50 hover:bg-muted/50">
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sync Data</span>
        </Button>
        <div className="h-4 w-px bg-border/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-medium text-white ring-2 ring-background">
          CE
        </div>
      </div>
    </header>
  )
}

