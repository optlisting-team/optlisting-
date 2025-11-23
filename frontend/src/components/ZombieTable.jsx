import { useState, useMemo } from 'react'
import SourceBadge from './SourceBadge'
import PlatformBadge from './PlatformBadge'

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
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Search Bar */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-end">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search in results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <table className="table-fixed w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
            <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Listed
            </th>
            <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Watch Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visibleZombies.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                {searchQuery ? `No items found matching "${searchQuery}"` : 'No items to display'}
              </td>
            </tr>
          ) : (
            visibleZombies.map((zombie) => (
            <tr key={zombie.id} className="hover:bg-gray-50 transition-colors">
              <td className="w-10 px-4 py-5 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="w-24 px-4 py-5 whitespace-nowrap">
                <PlatformBadge marketplace={zombie.marketplace || zombie.platform || 'eBay'} />
              </td>
              <td className="w-32 px-4 py-5 whitespace-nowrap text-sm font-mono text-gray-900 truncate" title={zombie.ebay_item_id || zombie.item_id}>
                {zombie.ebay_item_id || zombie.item_id}
              </td>
              <td className="px-4 py-5 text-sm font-semibold text-gray-900 truncate max-w-0" title={zombie.title}>
                {zombie.title}
              </td>
              <td className="w-32 px-4 py-5 whitespace-nowrap">
                <SourceBadge 
                  source={zombie.source || zombie.source_name} 
                  editable={!!onSourceChange}
                  onSourceChange={onSourceChange}
                  itemId={zombie.id}
                />
              </td>
              <td className="w-32 px-4 py-5 whitespace-nowrap text-sm text-gray-500 truncate" title={zombie.sku}>
                {zombie.sku}
              </td>
              <td className="w-24 px-4 py-5 whitespace-nowrap text-sm text-gray-900">
                {zombie.price ? formatPrice(zombie.price) : 'N/A'}
              </td>
              <td className="w-32 px-4 py-5 whitespace-nowrap text-sm text-gray-500">
                {formatDate(zombie.date_listed)}
              </td>
              <td className="w-24 px-4 py-5 whitespace-nowrap text-sm text-gray-500">
                {zombie.watch_count || 0}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {filteredZombies.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          {/* Left: Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Center: Page info */}
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredZombies.length)} of {filteredZombies.length} items
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

