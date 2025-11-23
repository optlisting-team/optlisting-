function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-center justify-between gap-6">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'all' 
              ? 'bg-blue-50 ring-2 ring-blue-600 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Listings
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-2">
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
                      <span key={platform} className={`text-sm text-slate-500 mt-2 ${colorClass}`}>
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
          className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer relative ${
            viewMode === 'zombies' 
              ? 'bg-rose-50 ring-2 ring-rose-500 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="flex flex-col">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Low Interest Detected
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : totalZombies.toLocaleString()}
            </div>
            {/* Trend Indicator */}
            {!loading && totalZombies > 0 && (
              <div className="flex items-center gap-1 text-sm text-green-600 font-medium mt-2">
                <span>↗</span>
                <span>Action required</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'queue' 
              ? 'bg-blue-50 ring-2 ring-blue-600 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ready to Delete
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-2">
              {queueCount || 0}
            </div>
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow transition-all duration-200 flex-1 p-6 cursor-pointer ${
            viewMode === 'history' 
              ? 'bg-slate-50 ring-2 ring-slate-500 border-transparent' 
              : 'hover:border-slate-200'
          }`}
        >
          <div className="flex flex-col">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Items Removed
            </div>
            <div className="text-5xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : (totalDeleted || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



