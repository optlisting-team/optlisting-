function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-center justify-between gap-4">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`p-6 rounded-2xl shadow-lg border-0 flex-1 text-center transition-all duration-200 bg-white cursor-pointer ${
            viewMode === 'all' 
              ? 'ring-4 ring-slate-200 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="text-4xl mb-3">📦</div>
          <div className="text-5xl font-extrabold text-slate-700 mb-2">
            {loading ? '...' : (totalListings || 0).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            Total Listings
          </div>
          {/* Platform Breakdown (판매처 플랫폼만 표시) */}
          {!loading && totalListings > 0 && (
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              <span className="text-xs font-medium text-purple-600">
                🟣 eBay: {platformBreakdown?.eBay || 0}
              </span>
              {platformBreakdown?.["Naver Smart Store"] > 0 && (
                <span className="text-xs font-medium text-green-600">
                  🟢 Naver: {platformBreakdown["Naver Smart Store"]}
                </span>
              )}
              {platformBreakdown?.Amazon > 0 && (
                <span className="text-xs font-medium text-yellow-600">
                  🟡 Amazon: {platformBreakdown.Amazon}
                </span>
              )}
              {platformBreakdown?.Shopify > 0 && (
                <span className="text-xs font-medium text-green-600">
                  🟢 Shopify: {platformBreakdown.Shopify}
                </span>
              )}
              {platformBreakdown?.Walmart > 0 && (
                <span className="text-xs font-medium text-blue-600">
                  🔵 Walmart: {platformBreakdown.Walmart}
                </span>
              )}
              {platformBreakdown?.Coupang > 0 && (
                <span className="text-xs font-medium text-rose-600">
                  🔴 Coupang: {platformBreakdown.Coupang}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Arrow 1 */}
        <div className="text-gray-300 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`p-6 rounded-2xl shadow-lg border-0 flex-1 text-center transition-all duration-200 bg-rose-50 relative cursor-pointer ${
            viewMode === 'zombies' 
              ? 'ring-4 ring-rose-100 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
          )}
          <div className="text-4xl mb-3">📉</div>
          <div className="text-5xl font-extrabold text-rose-600 mb-2">
            {loading ? '...' : totalZombies.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-rose-400 tracking-wider uppercase">
            Low Interest Detected
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="text-gray-300 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 3: In Queue (The Solution) */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`p-6 rounded-2xl shadow-lg border-0 flex-1 text-center transition-all duration-200 bg-blue-50 cursor-pointer ${
            viewMode === 'queue' 
              ? 'ring-4 ring-blue-100 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="text-4xl mb-3">🗑️</div>
          <div className="text-5xl font-extrabold text-blue-600 mb-2">
            {queueCount || 0}
          </div>
          <div className="text-xs font-bold text-blue-400 tracking-wider uppercase">
            Ready to Delete
          </div>
        </div>

        {/* Arrow 3 */}
        <div className="text-gray-300 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 4: History (Trophy / Graveyard) */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`p-6 rounded-2xl shadow-lg border-0 flex-1 text-center transition-all duration-200 bg-slate-800 cursor-pointer ${
            viewMode === 'history' 
              ? 'ring-4 ring-slate-300 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="text-4xl mb-3">💀</div>
          <div className="text-5xl font-extrabold text-white mb-2">
            {loading ? '...' : (totalDeleted || 0).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-300 tracking-wider uppercase">
            Total Items Removed
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard

