function SummaryCard({ totalListings, totalBreakdown = {}, platformBreakdown = {}, totalZombies, zombieBreakdown = {}, queueCount, totalDeleted, loading, filters = {}, viewMode = 'zombies', onViewModeChange }) {
  const handleCardClick = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }

  return (
    <div className="bg-zinc-900 dark:bg-zinc-900 rounded-lg border border-zinc-800 dark:border-zinc-800 p-8 shadow-sm space-y-6">
      {/* Row 1: Total Listings - Full Width (Primary Metric) */}
      <div className="w-full">
        <div 
          onClick={() => handleCardClick('all')}
          className={`p-8 rounded-lg border-2 border-zinc-800 dark:border-zinc-800 text-center transition-all duration-200 bg-zinc-900 dark:bg-zinc-900 cursor-pointer ${
            viewMode === 'all' 
              ? 'ring-4 ring-white dark:ring-white border-white dark:border-white shadow-lg' 
              : 'hover:border-zinc-700 dark:hover:border-zinc-700 hover:shadow-md'
          }`}
        >
          <div className="text-5xl mb-4">📦</div>
          <div className="text-7xl font-extrabold text-white dark:text-white mb-3">
            {loading ? '...' : (totalListings || 0).toLocaleString()}
          </div>
          <div className="text-sm font-bold text-zinc-400 dark:text-zinc-400 tracking-wider uppercase mb-3">
            Total Listings
          </div>
          {/* Platform Breakdown */}
          {!loading && totalListings > 0 && (
            <div className="flex gap-4 justify-center mt-3 flex-wrap">
              <span className="text-sm font-medium text-zinc-300 dark:text-zinc-300 px-3 py-1 bg-zinc-800 dark:bg-zinc-800 rounded">
                eBay: {platformBreakdown?.eBay || 0}
              </span>
              {platformBreakdown?.Shopify > 0 && (
                <span className="text-sm font-medium text-zinc-300 dark:text-zinc-300 px-3 py-1 bg-zinc-800 dark:bg-zinc-800 rounded">
                  Shopify: {platformBreakdown.Shopify}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Action/Status Cards - Grid Layout (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 2: Low Interest Items Found */}
        <div 
          onClick={() => handleCardClick('zombies')}
          className={`p-6 rounded-lg border border-zinc-800 dark:border-zinc-800 text-center transition-all duration-200 bg-zinc-900 dark:bg-zinc-900 relative cursor-pointer ${
            viewMode === 'zombies' 
              ? 'ring-2 ring-red-500 dark:ring-red-500 border-red-500 dark:border-red-500 shadow-lg' 
              : 'hover:border-zinc-700 dark:hover:border-zinc-700 hover:shadow-md'
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
            totalZombies > 0 ? 'text-red-500 dark:text-red-500' : 'text-zinc-400 dark:text-zinc-400'
          }`}>
            Low Interest Detected
          </div>
          {/* Store-Level Breakdown */}
          {!loading && totalZombies > 0 && Object.keys(zombieBreakdown).length > 0 && (
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {Object.entries(zombieBreakdown).map(([platform, count]) => (
                <span key={platform} className="text-xs font-medium text-red-500 dark:text-red-500">
                  {platform}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: In Queue */}
        <div 
          onClick={() => handleCardClick('queue')}
          className={`p-6 rounded-lg border border-zinc-800 dark:border-zinc-800 text-center transition-all duration-200 bg-zinc-900 dark:bg-zinc-900 cursor-pointer ${
            viewMode === 'queue' 
              ? 'ring-2 ring-white dark:ring-white border-white dark:border-white shadow-lg' 
              : 'hover:border-zinc-700 dark:hover:border-zinc-700 hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">🗑️</div>
          <div className="text-5xl font-extrabold text-white dark:text-white mb-2">
            {queueCount || 0}
          </div>
          <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">
            Ready to Delete
          </div>
        </div>

        {/* Card 4: History */}
        <div 
          onClick={() => handleCardClick('history')}
          className={`p-6 rounded-lg border border-zinc-800 dark:border-zinc-800 text-center transition-all duration-200 bg-zinc-900 dark:bg-zinc-900 cursor-pointer ${
            viewMode === 'history' 
              ? 'ring-2 ring-white dark:ring-white border-white dark:border-white shadow-lg' 
              : 'hover:border-zinc-700 dark:hover:border-zinc-700 hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">💀</div>
          <div className="text-5xl font-extrabold text-white dark:text-white mb-2">
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



