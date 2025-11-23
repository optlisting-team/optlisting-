function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-center justify-between gap-6">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex-1 p-6 cursor-pointer ${
            viewMode === 'all' 
              ? 'ring-2 ring-offset-2 ring-indigo-500 border-indigo-300' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📦</span>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {loading ? '...' : (totalListings || 0).toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Total Listings
              </div>
              <div className="text-xs text-green-600">↗ Updated just now</div>
            </div>
          </div>
          {/* Platform Breakdown */}
          {!loading && totalListings > 0 && platformBreakdown && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {Object.entries(platformBreakdown)
                .filter(([platform, count]) => count > 0)
                .map(([platform, count]) => {
                  const colorMap = {
                    'eBay': 'text-purple-600',
                    'Amazon': 'text-yellow-600',
                    'Shopify': 'text-green-600',
                    'Walmart': 'text-blue-600',
                    'Coupang': 'text-rose-600',
                    'Naver Smart Store': 'text-green-600',
                    'Gmarket': 'text-orange-600',
                    '11st': 'text-red-600',
                  }
                  const colorClass = colorMap[platform] || 'text-gray-600'
                  return (
                    <span key={platform} className={`text-xs font-medium ${colorClass}`}>
                      {platform}: {count}
                    </span>
                  )
                })}
            </div>
          )}
        </div>

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex-1 p-6 cursor-pointer relative ${
            viewMode === 'zombies' 
              ? 'ring-2 ring-offset-2 ring-rose-500 border-rose-300' 
              : 'hover:border-slate-300'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📉</span>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {loading ? '...' : totalZombies.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Low Interest Detected
              </div>
              <div className="text-xs text-rose-600">↗ Needs attention</div>
            </div>
          </div>
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex-1 p-6 cursor-pointer ${
            viewMode === 'queue' 
              ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-300' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🗑️</span>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {queueCount || 0}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Ready to Delete
              </div>
              <div className="text-xs text-blue-600">↗ Ready for export</div>
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex-1 p-6 cursor-pointer ${
            viewMode === 'history' 
              ? 'ring-2 ring-offset-2 ring-slate-500 border-slate-300' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💀</span>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {loading ? '...' : (totalDeleted || 0).toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Total Items Removed
              </div>
              <div className="text-xs text-slate-600">↗ All time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard

