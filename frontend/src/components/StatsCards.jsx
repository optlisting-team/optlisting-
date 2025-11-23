import { Package, TrendingDown, Trash2, Skull, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatsCards({ 
  totalListings = 0, 
  totalZombies = 0, 
  queueCount = 0, 
  totalDeleted = 0, 
  platformBreakdown = {},
  loading = false,
  viewMode = 'all',
  onViewModeChange 
}) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  // Get top 3 platforms for breakdown display
  const getTopPlatforms = () => {
    if (!platformBreakdown || Object.keys(platformBreakdown).length === 0) return []
    
    const platforms = Object.entries(platformBreakdown)
      .filter(([platform, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    
    return platforms
  }

  const topPlatforms = getTopPlatforms()
  const remainingCount = Object.entries(platformBreakdown || {})
    .filter(([platform, count]) => count > 0)
    .length - topPlatforms.length

  const getPlatformColor = (platform) => {
    const colorMap = {
      'eBay': 'bg-blue-500',
      'Amazon': 'bg-yellow-500',
      'Shopify': 'bg-green-500',
      'Walmart': 'bg-blue-500',
      'Coupang': 'bg-orange-400',
      'Naver Smart Store': 'bg-green-500',
      'Gmarket': 'bg-orange-500',
      '11st': 'bg-red-500',
    }
    return colorMap[platform] || 'bg-gray-400'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className={cn(
          "relative overflow-hidden border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer",
          viewMode === 'all' && 'border-primary/50 bg-primary/5'
        )}
        onClick={() => handleCardClick('all')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Listings
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{loading ? '...' : (totalListings || 0).toLocaleString()}</div>
          {!loading && totalListings > 0 && topPlatforms.length > 0 && (
            <div className="mt-3 space-y-1">
              {topPlatforms.map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className={cn("h-1 w-1 rounded-full", getPlatformColor(platform))} />
                    {platform}
                  </span>
                  <span className="font-mono">{count.toLocaleString()}</span>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="text-[10px] text-muted-foreground/60 pt-1">...and {remainingCount} more</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "relative overflow-hidden border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group cursor-pointer",
          viewMode === 'zombies' && 'border-red-500/50 bg-red-500/10'
        )}
        onClick={() => handleCardClick('zombies')}
      >
        {totalZombies > 0 && !loading && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-red-400">Low Interest</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">{loading ? '...' : totalZombies.toLocaleString()}</div>
          {!loading && totalZombies > 0 && (
            <div className="mt-4 flex items-center text-xs text-red-400 font-medium group-hover:underline">
              Action required
              <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "relative overflow-hidden border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer",
          viewMode === 'queue' && 'border-primary/50 bg-primary/5'
        )}
        onClick={() => handleCardClick('queue')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Ready to Delete
          </CardTitle>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-muted-foreground">{queueCount || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Items with 0 views &gt; 30 days</p>
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "relative overflow-hidden border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer",
          viewMode === 'history' && 'border-primary/50 bg-primary/5'
        )}
        onClick={() => handleCardClick('history')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Removed
          </CardTitle>
          <Skull className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-muted-foreground">{loading ? '...' : (totalDeleted || 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime optimization</p>
        </CardContent>
      </Card>
    </div>
  )
}

