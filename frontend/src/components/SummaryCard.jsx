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
          className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md ${
            viewMode === 'all' 
              ? 'ring-2 ring-blue-500 bg-blue-50/30 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Listings
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-1 tracking-tight mb-4">
              {loading ? '...' : (totalListings || 0).toLocaleString()}
            </div>
          </div>
          
          {/* Platform Breakdown - Top 3 Only */}
          {!loading && totalListings > 0 && topPlatforms.length > 0 && (
            <div className="mt-auto space-y-1.5">
              {topPlatforms.map(([platform, count]) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${getPlatformColor(platform)}`}></div>
                  <span className="text-xs text-slate-600 font-medium">
                    {platform}: {count.toLocaleString()}
                  </span>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="text-xs text-slate-400 font-medium pt-1">
                  ...and {remainingCount} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md relative ${
            viewMode === 'zombies' 
              ? 'ring-2 ring-rose-500 bg-rose-50/30 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex flex-col">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <span className="text-2xl">📉</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Low Interest Detected
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-1 tracking-tight mb-4">
              {loading ? '...' : totalZombies.toLocaleString()}
            </div>
          </div>
          
          {/* Trend Indicator */}
          {!loading && totalZombies > 0 && (
            <div className="mt-auto flex items-center gap-1 text-xs text-green-600 font-medium">
              <span>↗</span>
              <span>Action required</span>
            </div>
          )}
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md ${
            viewMode === 'queue' 
              ? 'ring-2 ring-indigo-500 bg-indigo-50/30 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ready to Delete
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {queueCount || 0}
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-md ${
            viewMode === 'history' 
              ? 'ring-2 ring-slate-500 bg-slate-50/30 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <span className="text-2xl">💀</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Items Removed
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {loading ? '...' : (totalDeleted || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



