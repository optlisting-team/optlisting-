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

  const getPlatformColor = (platform) => {
    const colorMap = {
      'eBay': 'bg-slate-500',
      'Amazon': 'bg-yellow-500',
      'Shopify': 'bg-green-500',
      'Walmart': 'bg-blue-500',
      'Coupang': 'bg-rose-500',
      'Naver Smart Store': 'bg-green-500',
      'Gmarket': 'bg-orange-500',
      '11st': 'bg-red-500',
    }
    return colorMap[platform] || 'bg-slate-400'
  }

  return (
    <div className="mb-8">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-stretch justify-between gap-6">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`bg-white border border-gray-200 rounded-lg p-6 h-auto flex flex-col justify-between cursor-pointer transition-colors hover:border-gray-400 ${
            viewMode === 'all' 
              ? 'border-gray-400' 
              : ''
          }`}
        >
          <div className="flex flex-col">
            <div className="text-gray-900 mb-2">
              <span className="text-xl">📦</span>
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
              Total Listings
            </div>
            <div className="text-4xl font-semibold text-black mt-2">
              {loading ? '...' : (totalListings || 0).toLocaleString()}
            </div>
          </div>
          
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

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`bg-white border border-gray-200 rounded-lg p-6 h-auto flex flex-col justify-between cursor-pointer transition-colors hover:border-gray-400 relative ${
            viewMode === 'zombies' 
              ? 'border-gray-400' 
              : ''
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex flex-col">
            <div className="text-gray-900 mb-2">
              <span className="text-xl">📉</span>
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
              Low Interest Detected
            </div>
            <div className="text-4xl font-semibold text-black mt-2">
              {loading ? '...' : totalZombies.toLocaleString()}
            </div>
          </div>
          
          {/* Trend Indicator */}
          {!loading && totalZombies > 0 && (
            <div className="mt-6 flex items-center gap-1 text-xs text-gray-600">
              <span>↗</span>
              <span>Action required</span>
            </div>
          )}
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white border border-gray-200 rounded-lg p-6 h-auto flex flex-col justify-between cursor-pointer transition-colors hover:border-gray-400 ${
            viewMode === 'queue' 
              ? 'border-gray-400' 
              : ''
          }`}
        >
          <div className="flex flex-col">
            <div className="text-gray-900 mb-2">
              <span className="text-xl">🗑️</span>
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
              Ready to Delete
            </div>
            <div className="text-4xl font-semibold text-black mt-2">
              {queueCount || 0}
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white border border-gray-200 rounded-lg p-6 h-auto flex flex-col justify-between cursor-pointer transition-colors hover:border-gray-400 ${
            viewMode === 'history' 
              ? 'border-gray-400' 
              : ''
          }`}
        >
          <div className="flex flex-col">
            <div className="text-gray-900 mb-2">
              <span className="text-xl">💀</span>
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
              Total Items Removed
            </div>
            <div className="text-4xl font-semibold text-black mt-2">
              {loading ? '...' : (totalDeleted || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



