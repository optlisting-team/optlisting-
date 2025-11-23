import { useState, useEffect } from 'react'
import { Button } from './ui/button'

function FilterBar({ onApplyFilter, loading, initialFilters = {} }) {
  // Calculate default cutoff date (3 days ago)
  const getDefaultCutoffDate = () => {
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() - 3)
    return defaultDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
  }

  // Convert days to cutoff date string
  const daysToCutoffDate = (days) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  }

  // Convert cutoff date to days (difference from today)
  const cutoffDateToDays = (dateString) => {
    if (!dateString) return 3
    const selectedDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    const diffTime = today - selectedDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const [marketplaceFilter, setMarketplaceFilter] = useState(initialFilters.marketplace_filter || 'All')
  const [cutoffDate, setCutoffDate] = useState(
    initialFilters.cutoff_date || (initialFilters.min_days ? daysToCutoffDate(initialFilters.min_days) : getDefaultCutoffDate())
  )
  const [maxSales, setMaxSales] = useState(initialFilters.max_sales || 0)
  const [maxWatchCount, setMaxWatchCount] = useState(initialFilters.max_watch_count || 10)
  const [supplierFilter, setSupplierFilter] = useState(initialFilters.supplier_filter || initialFilters.source_filter || 'All')

  // Update state when initialFilters change
  useEffect(() => {
    setMarketplaceFilter(initialFilters.marketplace_filter || 'All')
    setCutoffDate(
      initialFilters.cutoff_date || (initialFilters.min_days ? daysToCutoffDate(initialFilters.min_days) : getDefaultCutoffDate())
    )
    setMaxSales(initialFilters.max_sales || 0)
    setMaxWatchCount(initialFilters.max_watch_count || 10)
    setSupplierFilter(initialFilters.supplier_filter || initialFilters.source_filter || 'All')
  }, [initialFilters])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert cutoff date to days
    const calculatedDays = cutoffDateToDays(cutoffDate)
    const safeMinDays = Math.max(0, calculatedDays)
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
    setCutoffDate(getDefaultCutoffDate())
    setMaxSales(0)
    setMaxWatchCount(10)
    setSupplierFilter('All')
    const defaultDays = cutoffDateToDays(getDefaultCutoffDate())
    onApplyFilter({
      marketplace_filter: 'All',
      min_days: defaultDays,
      max_sales: 0,
      max_watch_count: 10,
      supplier_filter: 'All'
    })
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 mb-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-4 flex-wrap">
        {/* Platform Filter */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🏪</span>
            </div>
            <select
              id="marketplaceFilter"
              value={marketplaceFilter}
              onChange={(e) => setMarketplaceFilter(e.target.value)}
              className="w-full pl-10 pr-3 h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white"
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
        </div>

        {/* Listed Before - Date Picker */}
        <div className="min-w-[180px]">
          <label htmlFor="cutoffDate" className="block text-xs font-medium text-slate-700 mb-1">
            Listed Before
          </label>
          <input
            type="date"
            id="cutoffDate"
            value={cutoffDate}
            onChange={(e) => setCutoffDate(e.target.value)}
            className="cursor-pointer h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white block w-full"
          />
        </div>

        {/* Max Sales */}
        <div className="min-w-[120px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">💰</span>
            </div>
            <input
              type="number"
              id="maxSales"
              min="0"
              value={maxSales}
              onChange={(e) => setMaxSales(e.target.value)}
              className="w-full pl-10 pr-3 h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* Max Watch Count */}
        <div className="min-w-[140px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">👁️</span>
            </div>
            <input
              type="number"
              id="maxWatchCount"
              min="0"
              value={maxWatchCount}
              onChange={(e) => setMaxWatchCount(e.target.value)}
              className="w-full pl-10 pr-3 h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white"
              placeholder="10"
            />
          </div>
        </div>

        {/* Supplier Filter */}
        <div className="min-w-[160px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🏭</span>
            </div>
            <select
              id="supplierFilter"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full pl-10 pr-3 h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white"
            >
            <option value="All">All Suppliers</option>
            <option value="Amazon">Amazon</option>
            <option value="Walmart">Walmart</option>
            <option value="Wholesale2B">Wholesale2B</option>
            <option value="Doba">Doba</option>
            <option value="DSers">DSers</option>
            <option value="Spocket">Spocket</option>
            <option value="CJ Dropshipping">CJ Dropshipping</option>
            <option value="Unknown">Unknown</option>
          </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            size="default"
          >
            {loading ? 'Loading...' : 'Apply'}
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            disabled={loading}
            variant="outline"
            size="default"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FilterBar

