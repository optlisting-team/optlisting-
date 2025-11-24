import { useState, useEffect } from 'react'

function FilterBar({ onApplyFilter, onSync, loading, initialFilters = {} }) {
  const [marketplaceFilter, setMarketplaceFilter] = useState(initialFilters.marketplace_filter || 'eBay')
  const [minDays, setMinDays] = useState(initialFilters.min_days || 3)
  const [maxSales, setMaxSales] = useState(initialFilters.max_sales || 0)
  const [maxWatchCount, setMaxWatchCount] = useState(initialFilters.max_watch_count || 10)
  const [sourceFilter, setSourceFilter] = useState(initialFilters.source_filter || 'All')

  // Update state when initialFilters change
  useEffect(() => {
    setMarketplaceFilter(initialFilters.marketplace_filter || 'eBay')
    setMinDays(initialFilters.min_days || 3)
    setMaxSales(initialFilters.max_sales || 0)
    setMaxWatchCount(initialFilters.max_watch_count || 10)
    setSourceFilter(initialFilters.source_filter || 'All')
  }, [initialFilters])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ensure values are non-negative
    const safeMinDays = Math.max(0, parseInt(minDays) || 0)
    const safeMaxSales = Math.max(0, parseInt(maxSales) || 0)
    const safeMaxWatchCount = Math.max(0, parseInt(maxWatchCount) || 0)
    
    onApplyFilter({
      marketplace_filter: marketplaceFilter,
      min_days: safeMinDays,
      max_sales: safeMaxSales,
      max_watch_count: safeMaxWatchCount,
      source_filter: sourceFilter
    })
  }

  const handleReset = () => {
    setMarketplaceFilter('eBay')
    setMinDays(3)
    setMaxSales(0)
    setMaxWatchCount(10)
    setSourceFilter('All')
    onApplyFilter({
      marketplace_filter: 'eBay',
      min_days: 3,
      max_sales: 0,
      max_watch_count: 10,
      source_filter: 'All'
    })
  }

  const handleSync = () => {
    if (onSync) {
      onSync()
    } else {
      console.log('Syncing data...')
    }
  }

  // Calculate cutoff date based on minDays
  const calculateCutoffDate = (days) => {
    const date = new Date()
    date.setDate(date.getDate() - (parseInt(days) || 0))
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="bg-zinc-900 dark:bg-zinc-900 rounded-lg border border-zinc-800 dark:border-zinc-800 p-6 mb-8">
      <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
        Filter Low Interest Items
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Platform Filter - First and Most Important */}
        <div>
          <label htmlFor="marketplaceFilter" className="block text-sm font-medium text-zinc-300 dark:text-zinc-300 mb-2">
            Platform
          </label>
          <select
            id="marketplaceFilter"
            value={marketplaceFilter}
            onChange={(e) => setMarketplaceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-white focus:border-white dark:focus:border-white bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white"
          >
            <option value="eBay">eBay</option>
            <option value="Shopify">Shopify</option>
          </select>
        </div>

        {/* Days Older Than */}
        <div>
          <label htmlFor="minDays" className="block text-sm font-medium text-zinc-300 dark:text-zinc-300 mb-2">
            Days Older Than
          </label>
          <input
            type="number"
            id="minDays"
            min="0"
            value={minDays}
            onChange={(e) => setMinDays(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-white focus:border-white dark:focus:border-white bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white"
            placeholder="3"
          />
          <p className="mt-1 text-xs text-blue-400 dark:text-blue-400 font-medium">
            Cutoff Date: {calculateCutoffDate(minDays)}
          </p>
        </div>

        {/* Max Sales */}
        <div>
          <label htmlFor="maxSales" className="block text-sm font-medium text-zinc-300 dark:text-zinc-300 mb-2">
            Max Sales
          </label>
          <input
            type="number"
            id="maxSales"
            min="0"
            value={maxSales}
            onChange={(e) => setMaxSales(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-white focus:border-white dark:focus:border-white bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white"
            placeholder="0"
          />
        </div>

        {/* Max Watch Count */}
        <div>
          <label htmlFor="maxWatchCount" className="block text-sm font-medium text-zinc-300 dark:text-zinc-300 mb-2">
            Max Watch Count
          </label>
          <input
            type="number"
            id="maxWatchCount"
            min="0"
            value={maxWatchCount}
            onChange={(e) => setMaxWatchCount(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-white focus:border-white dark:focus:border-white bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white"
            placeholder="10"
          />
        </div>

        {/* Source Filter */}
        <div>
          <label htmlFor="sourceFilter" className="block text-sm font-medium text-zinc-300 dark:text-zinc-300 mb-2">
            Source
          </label>
          <select
            id="sourceFilter"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-white focus:border-white dark:focus:border-white bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white"
          >
            <option value="All">All Sources</option>
            <option value="Amazon">Amazon</option>
            <option value="Walmart">Walmart</option>
            <option value="Home Depot">Home Depot</option>
            <option value="AliExpress">AliExpress</option>
            <option value="CJ Dropshipping">CJ Dropshipping</option>
            <option value="Wholesale2B">Wholesale2B</option>
            <option value="Costway">Costway</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-white dark:bg-white text-black dark:text-black font-medium rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Apply Filter'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 dark:bg-zinc-800 border border-zinc-700 dark:border-zinc-700 text-white dark:text-white font-medium rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-800 border border-zinc-700 dark:border-zinc-700 text-white dark:text-white font-medium rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Sync Data</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default FilterBar

