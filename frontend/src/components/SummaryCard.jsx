function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, zombieBreakdown = {}, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-8 shadow-sm">
      {/* Pipeline: Single Flex Container */}
      <div className="flex items-center justify-between gap-4">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleCardClick('all')}
          className={`p-6 rounded-lg border border-gray-300 flex-1 text-center transition-all duration-200 bg-white cursor-pointer ${
            viewMode === 'all' 
              ? 'ring-2 ring-gray-900 border-gray-900' 
              : 'hover:border-gray-400'
          }`}
        >
          <div className="text-4xl mb-3">📦</div>
          <div className="text-5xl font-extrabold text-gray-900 mb-2">
            {loading ? '...' : (totalListings || 0).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
            Total Listings
          </div>
          {/* Platform Breakdown */}
          {!loading && totalListings > 0 && (
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              <span className="text-xs font-medium text-gray-600">
                eBay: {platformBreakdown?.eBay || 0}
              </span>
              {platformBreakdown?.Shopify > 0 && (
                <span className="text-xs font-medium text-gray-600">
                  Shopify: {platformBreakdown.Shopify}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Arrow 1 */}
        <div className="text-gray-400 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`p-6 rounded-lg border border-gray-300 flex-1 text-center transition-all duration-200 bg-white relative cursor-pointer ${
            viewMode === 'zombies' 
              ? 'ring-2 ring-red-500 border-red-500' 
              : 'hover:border-gray-400'
          }`}
        >
          {totalZombies > 0 && !loading && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
          <div className="text-4xl mb-3">📉</div>
          <div className={`text-5xl font-extrabold mb-2 ${
            totalZombies > 0 ? 'text-red-500' : 'text-gray-900'
          }`}>
            {loading ? '...' : totalZombies.toLocaleString()}
          </div>
          <div className={`text-xs font-bold tracking-wider uppercase ${
            totalZombies > 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            Low Interest Detected
          </div>
          {/* Store-Level Breakdown */}
          {!loading && totalZombies > 0 && Object.keys(zombieBreakdown).length > 0 && (
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {Object.entries(zombieBreakdown).map(([platform, count]) => (
                <span key={platform} className="text-xs font-medium text-red-600">
                  {platform}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow 2 */}
        <div className="text-gray-400 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`p-6 rounded-lg border border-gray-300 flex-1 text-center transition-all duration-200 bg-white cursor-pointer ${
            viewMode === 'queue' 
              ? 'ring-2 ring-gray-900 border-gray-900' 
              : 'hover:border-gray-400'
          }`}
        >
          <div className="text-4xl mb-3">🗑️</div>
          <div className="text-5xl font-extrabold text-gray-900 mb-2">
            {queueCount || 0}
          </div>
          <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">
            Ready to Delete
          </div>
        </div>

        {/* Arrow 3 */}
        <div className="text-gray-400 text-3xl flex-shrink-0">
          ›
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`p-6 rounded-lg border border-gray-300 flex-1 text-center transition-all duration-200 bg-white cursor-pointer ${
            viewMode === 'history' 
              ? 'ring-2 ring-gray-900 border-gray-900' 
              : 'hover:border-gray-400'
          }`}
        >
          <div className="text-4xl mb-3">💀</div>
          <div className="text-5xl font-extrabold text-gray-900 mb-2">
            {loading ? '...' : (totalDeleted || 0).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">
            Total Items Removed
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard



