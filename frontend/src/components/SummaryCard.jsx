import { cn } from "@/lib/utils"
import { Package, TrendingDown, Trash2, History } from "lucide-react"

function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1: Total Listings */}
      <div
        onClick={() => handleCardClick('all')}
        className={cn(
          "bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-sm relative",
          viewMode === 'all' && 'border-gray-300 shadow-sm'
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Total Listings
            </p>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : (totalListings || 0).toLocaleString()}
            </p>
            
            {/* Platform Breakdown - Top 3 Only */}
            {!loading && totalListings > 0 && topPlatforms.length > 0 && (
              <div className="mt-6 space-y-1.5">
                {topPlatforms.map(([platform, count]) => (
                  <div key={platform} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span className="text-xs text-gray-600 font-medium">
                      {platform}: {count.toLocaleString()}
                    </span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="text-xs text-gray-500 font-medium pt-1">
                    ...and {remainingCount} more
                  </div>
                )}
              </div>
            )}
          </div>
          <Package className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* Card 2: Low Interest Items Found */}
      <div
        onClick={() => handleCardClick('zombies')}
        className={cn(
          "bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-sm relative",
          viewMode === 'zombies' && 'border-gray-300 shadow-sm'
        )}
      >
        {totalZombies > 0 && !loading && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Low Interest Detected
            </p>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : totalZombies.toLocaleString()}
            </p>
            
            {/* Trend Indicator */}
            {!loading && totalZombies > 0 && (
              <div className="mt-6 flex items-center gap-1 text-xs text-red-600">
                <span>↗</span>
                <span>Action required</span>
              </div>
            )}
          </div>
          <TrendingDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* Card 3: In Queue */}
      <div
        onClick={() => handleCardClick('queue')}
        className={cn(
          "bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-sm",
          viewMode === 'queue' && 'border-gray-300 shadow-sm'
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Ready to Delete
            </p>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {queueCount || 0}
            </p>
          </div>
          <Trash2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* Card 4: History */}
      <div
        onClick={() => handleCardClick('history')}
        className={cn(
          "bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-sm",
          viewMode === 'history' && 'border-gray-300 shadow-sm'
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Total Items Removed
            </p>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {loading ? '...' : (totalDeleted || 0).toLocaleString()}
            </p>
          </div>
          <History className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



