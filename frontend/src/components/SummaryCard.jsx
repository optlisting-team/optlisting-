function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-center justify-between gap-6">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'all' 
              ? 'bg-blue-50 ring-2 ring-blue-600 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg text-blue-600">📦</span>
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Listings
              </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mb-4">
              {loading ? '...' : (totalListings || 0).toLocaleString()}
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
                    const colorClass = colorMap[platform] || 'text-slate-500'
                    return (
                      <span key={platform} className={`text-sm ${colorClass}`}>
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
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer relative ${
            viewMode === 'zombies' 
              ? 'bg-rose-50 ring-2 ring-rose-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg text-rose-600">📉</span>
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Low Interest Detected
              </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mb-4">
              {loading ? '...' : totalZombies.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'queue' 
              ? 'bg-blue-50 ring-2 ring-blue-600 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg text-blue-600">🗑️</span>
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ready to Delete
              </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mb-4">
              {queueCount || 0}
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'history' 
              ? 'bg-slate-50 ring-2 ring-slate-500 border-transparent' 
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg text-slate-600">💀</span>
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Items Removed
              </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mb-4">
              {loading ? '...' : (totalDeleted || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



