import { useState, useEffect } from 'react'

function FilterBar({ onApplyFilter, loading, initialFilters = {} }) {
  const [marketplaceFilter, setMarketplaceFilter] = useState(initialFilters.marketplace_filter || 'All')
  const [minDays, setMinDays] = useState(initialFilters.min_days || 3)
  const [maxSales, setMaxSales] = useState(initialFilters.max_sales || 0)
  const [maxWatchCount, setMaxWatchCount] = useState(initialFilters.max_watch_count || 10)
  const [supplierFilter, setSupplierFilter] = useState(initialFilters.supplier_filter || initialFilters.source_filter || 'All')

  // Update state when initialFilters change
  useEffect(() => {
    setMarketplaceFilter(initialFilters.marketplace_filter || 'All')
    setMinDays(initialFilters.min_days || 3)
    setMaxSales(initialFilters.max_sales || 0)
    setMaxWatchCount(initialFilters.max_watch_count || 10)
    setSupplierFilter(initialFilters.supplier_filter || initialFilters.source_filter || 'All')
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
      supplier_filter: supplierFilter
    })
  }

  const handleReset = () => {
    setMarketplaceFilter('All')
    setMinDays(3)
    setMaxSales(0)
    setMaxWatchCount(10)
    setSupplierFilter('All')
    onApplyFilter({
      marketplace_filter: 'All',
      min_days: 3,
      max_sales: 0,
      max_watch_count: 10,
      supplier_filter: 'All'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filter Low Interest Items
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Platform Filter - First and Most Important */}
        <div>
          <label htmlFor="marketplaceFilter" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="mr-1">🏪</span> Platform
          </label>
          <select
            id="marketplaceFilter"
            value={marketplaceFilter}
            onChange={(e) => setMarketplaceFilter(e.target.value)}
            className="w-full px-3 py-2 border-2 border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
          >
            <option value="All">All Platforms</option>
            
            <optgroup label="🇰🇷 South Korea">
              <option value="Naver Smart Store">🇰🇷 Naver Smart Store</option>
              <option value="Coupang">🇰🇷 Coupang</option>
              <option value="Gmarket">🇰🇷 Gmarket</option>
              <option value="11st">🇰🇷 11st</option>
            </optgroup>
            
            <optgroup label="🇺🇸 North America">
              <option value="eBay">🇺🇸 eBay</option>
              <option value="Amazon">🇺🇸 Amazon</option>
              <option value="Shopify">🇨🇦 Shopify</option>
              <option value="Walmart">🇺🇸 Walmart</option>
              <option value="Etsy">🇺🇸 Etsy</option>
              <option value="Target">🇺🇸 Target</option>
            </optgroup>
            
            <optgroup label="🇯🇵🇹🇼 Japan & Taiwan">
              <option value="Rakuten">🇯🇵 Rakuten</option>
              <option value="Qoo10">🇸🇬 Qoo10</option>
              <option value="Shopee TW">🇹🇼 Shopee TW</option>
              <option value="Momo">🇹🇼 Momo</option>
              <option value="Ruten">🇹🇼 Ruten</option>
            </optgroup>
            
            <optgroup label="🌏 South East Asia">
              <option value="Shopee">🇸🇬 Shopee</option>
              <option value="Lazada">🇸🇬 Lazada</option>
              <option value="Tokopedia">🇮🇩 Tokopedia</option>
            </optgroup>
            
            <optgroup label="🇪🇺 Europe">
              <option value="Allegro">🇵🇱 Allegro</option>
              <option value="Zalando">🇩🇪 Zalando</option>
              <option value="Cdiscount">🇫🇷 Cdiscount</option>
              <option value="Otto">🇩🇪 Otto</option>
            </optgroup>
            
            <optgroup label="🌎 Latin America & Others">
              <option value="Mercado Libre">🇦🇷 Mercado Libre</option>
              <option value="Wildberries">🇷🇺 Wildberries</option>
              <option value="Flipkart">🇮🇳 Flipkart</option>
              <option value="Ozon">🇷🇺 Ozon</option>
            </optgroup>
          </select>
        </div>

        {/* Days Older Than */}
        <div>
          <label htmlFor="minDays" className="block text-sm font-medium text-gray-700 mb-2">
            Days Older Than
          </label>
          <input
            type="number"
            id="minDays"
            min="0"
            value={minDays}
            onChange={(e) => setMinDays(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="3"
          />
        </div>

        {/* Max Sales */}
        <div>
          <label htmlFor="maxSales" className="block text-sm font-medium text-gray-700 mb-2">
            Max Sales
          </label>
          <input
            type="number"
            id="maxSales"
            min="0"
            value={maxSales}
            onChange={(e) => setMaxSales(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        {/* Max Watch Count */}
        <div>
          <label htmlFor="maxWatchCount" className="block text-sm font-medium text-gray-700 mb-2">
            Max Watch Count
          </label>
          <input
            type="number"
            id="maxWatchCount"
            min="0"
            value={maxWatchCount}
            onChange={(e) => setMaxWatchCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="10"
          />
        </div>

        {/* Supplier Filter */}
        <div>
          <label htmlFor="supplierFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Supplier
          </label>
          <select
            id="supplierFilter"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value="Amazon">Amazon</option>
            <option value="Walmart">Walmart</option>
            <option value="AliExpress">AliExpress</option>
            <option value="CJ Dropshipping">CJ Dropshipping</option>
            <option value="Home Depot">Home Depot</option>
            <option value="Wayfair">Wayfair</option>
            <option value="Costco">Costco</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Apply Filter'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default FilterBar

