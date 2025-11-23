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
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'all' 
              ? 'bg-blue-50 ring-2 ring-blue-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-blue-600">📦</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Listings
                </div>
                <div className="text-4xl font-extrabold text-slate-800 mt-2">
                  {loading ? '...' : (totalListings || 0).toLocaleString()}
                </div>
              </div>
            </div>
            {/* Platform Breakdown */}
            {!loading && totalListings > 0 && platformBreakdown && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.entries(platformBreakdown)
                  .filter(([platform, count]) => count > 0)
                  .map(([platform, count]) => {
                    const colorMap = {
                      'eBay': 'text-slate-600',
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
        </div>

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 p-6 cursor-pointer relative ${
            viewMode === 'zombies' 
              ? 'bg-rose-50 ring-2 ring-rose-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-rose-600">📉</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Low Interest Detected
                </div>
                <div className="text-4xl font-extrabold text-slate-800 mt-2">
                  {loading ? '...' : totalZombies.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'queue' 
              ? 'bg-blue-50 ring-2 ring-blue-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-blue-600">🗑️</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ready to Delete
                </div>
                <div className="text-4xl font-extrabold text-slate-800 mt-2">
                  {queueCount || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'history' 
              ? 'bg-slate-50 ring-2 ring-slate-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-slate-600">💀</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Items Removed
                </div>
                <div className="text-4xl font-extrabold text-slate-800 mt-2">
                  {loading ? '...' : (totalDeleted || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard

