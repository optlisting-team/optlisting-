import { useState, useMemo } from 'react'
import SourceBadge from './SourceBadge'

function ZombieTable({ zombies, selectedIds, onSelect, onSelectAll, onSourceChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Filter zombies based on search query
  const filteredZombies = useMemo(() => {
    if (!searchQuery.trim()) return zombies
    
    const query = searchQuery.toLowerCase()
    return zombies.filter(zombie => {
      const title = (zombie.title || '').toLowerCase()
      const sku = (zombie.sku || '').toLowerCase()
      const itemId = ((zombie.ebay_item_id || zombie.item_id) || '').toLowerCase()
      
      return title.includes(query) || sku.includes(query) || itemId.includes(query)
    })
  }, [zombies, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredZombies.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const visibleZombies = filteredZombies.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle select all for current page only
  const handleSelectAllPage = (checked) => {
    if (checked) {
      const pageIds = visibleZombies.map(z => z.id)
      // Add all page items to selection (avoid duplicates)
      const newSelectedIds = [...new Set([...selectedIds, ...pageIds])]
      onSelectAll(newSelectedIds)
    } else {
      // Remove only current page items from selection
      const pageIds = visibleZombies.map(z => z.id)
      const newSelectedIds = selectedIds.filter(id => !pageIds.includes(id))
      onSelectAll(newSelectedIds)
    }
  }

  // Check if all visible items are selected
  const allVisibleSelected = visibleZombies.length > 0 && visibleZombies.every(z => selectedIds.includes(z.id))
  const someVisibleSelected = visibleZombies.some(z => selectedIds.includes(z.id))

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  return (
    <div className="w-full shadow-xl rounded-2xl overflow-hidden bg-white ring-1 ring-slate-900/5">
      {/* Search Bar & Rows Selector */}
      <div className="bg-slate-50/80 backdrop-blur-sm px-4 py-3 border-b border-slate-200/50 flex items-center justify-between">
        {/* Left: Rows per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="border-0 ring-1 ring-slate-200 rounded-md px-2 py-1 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-slate-700">items</span>
        </div>

        {/* Right: Search Bar */}
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search in results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border-0 ring-1 ring-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
          />
        </div>
      </div>

      <table className="table-fixed w-full">
        <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/50">
          <tr>
            <th className="w-10 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someVisibleSelected && !allVisibleSelected
                }}
                onChange={(e) => handleSelectAllPage(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                title="Select all items on this page"
              />
            </th>
            <th className="w-24 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Platform
            </th>
            <th className="w-32 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Item ID
            </th>
            <th className="px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Title
            </th>
            <th className="w-32 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Supplier
            </th>
            <th className="w-32 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              SKU
            </th>
            <th className="w-24 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Price
            </th>
            <th className="w-32 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Date Listed
            </th>
            <th className="w-24 px-4 py-4 text-left text-xs font-bold tracking-widest text-slate-400 uppercase">
              Watch Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {visibleZombies.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-slate-600 font-medium text-lg mb-1">
                    {searchQuery ? `No items found matching "${searchQuery}"` : 'No listings found'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {searchQuery ? 'Try adjusting your search query' : 'Try syncing data'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            visibleZombies.map((zombie) => (
            <tr 
              key={zombie.id} 
              className="bg-white border-b border-slate-100 hover:bg-blue-50/50 transition-all duration-200 ease-in-out hover:scale-[1.005] hover:shadow-md hover:z-10 relative group"
            >
              <td className="w-10 px-4 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="w-24 px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-slate-600">
                      {(zombie.marketplace || zombie.platform || 'eBay').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {zombie.marketplace || zombie.platform || 'eBay'}
                  </span>
                </div>
              </td>
              <td className="w-32 px-4 py-4 whitespace-nowrap text-sm font-mono text-slate-700 truncate" title={zombie.ebay_item_id || zombie.item_id}>
                {zombie.ebay_item_id || zombie.item_id}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-slate-800 truncate max-w-0" title={zombie.title}>
                {zombie.title}
              </td>
              <td className="w-32 px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <SourceBadge 
                    source={zombie.supplier || zombie.supplier_name || zombie.source || zombie.source_name} 
                    editable={!!onSourceChange}
                    onSourceChange={onSourceChange}
                    itemId={zombie.id}
                  />
                </div>
              </td>
              <td className="w-32 px-4 py-4 whitespace-nowrap text-sm text-slate-600 truncate" title={zombie.sku}>
                {zombie.sku}
              </td>
              <td className="w-24 px-4 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                {zombie.price ? formatPrice(zombie.price) : 'N/A'}
              </td>
              <td className="w-32 px-4 py-4 whitespace-nowrap text-xs text-slate-400 font-light">
                {formatDate(zombie.date_listed)}
              </td>
              <td className="w-24 px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                {zombie.watch_count || 0}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {filteredZombies.length > 0 && (
        <div className="bg-slate-50/80 backdrop-blur-sm px-4 py-3 border-t border-slate-200/50 flex items-center justify-between">
          {/* Left: Page info (moved from center) */}
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredZombies.length)} of {filteredZombies.length} listings
            {searchQuery && ` (filtered from ${zombies.length} total)`}
          </div>


          {/* Right: Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZombieTable

