import { useState, useMemo } from 'react'
import SourceBadge from './SourceBadge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table'
import { Button } from './ui/button'
import { Card } from './ui/card'

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
    <Card className="w-full overflow-hidden">
      {/* Search Bar & Rows Selector */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        {/* Left: Rows per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="h-9 text-sm px-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">items</span>
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
            className="block w-full pl-10 pr-3 h-9 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-black focus:border-black bg-white placeholder-gray-400"
          />
        </div>
      </div>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
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
            </TableHead>
            <TableHead className="w-24">Platform</TableHead>
            <TableHead className="w-32">Item ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Supplier</TableHead>
            <TableHead className="w-32">SKU</TableHead>
            <TableHead className="w-24">Price</TableHead>
            <TableHead className="w-32">Date Listed</TableHead>
            <TableHead className="w-24">Watch Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleZombies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-900 font-medium text-lg mb-1">
                    {searchQuery ? `No items found matching "${searchQuery}"` : 'No listings found'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? 'Try adjusting your search query' : 'Try syncing data'}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            visibleZombies.map((zombie) => (
            <TableRow key={zombie.id}>
              <TableCell className="w-10 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-700">
                      {(zombie.marketplace || zombie.platform || 'eBay').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {zombie.marketplace || zombie.platform || 'eBay'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="w-32 whitespace-nowrap text-sm font-mono text-gray-700 truncate" title={zombie.ebay_item_id || zombie.item_id}>
                {zombie.ebay_item_id || zombie.item_id}
              </TableCell>
              <TableCell className="text-sm font-medium text-gray-900 truncate max-w-0" title={zombie.title}>
                {zombie.title}
              </TableCell>
              <TableCell className="w-32 whitespace-nowrap">
                <div className="flex items-center">
                  <SourceBadge 
                    source={zombie.supplier || zombie.supplier_name || zombie.source || zombie.source_name} 
                    editable={!!onSourceChange}
                    onSourceChange={onSourceChange}
                    itemId={zombie.id}
                  />
                </div>
              </TableCell>
              <TableCell className="w-32 whitespace-nowrap text-sm text-gray-600 truncate" title={zombie.sku}>
                {zombie.sku}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap text-sm font-semibold text-black">
                {zombie.price ? formatPrice(zombie.price) : 'N/A'}
              </TableCell>
              <TableCell className="w-32 whitespace-nowrap text-xs text-gray-500">
                {formatDate(zombie.date_listed)}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap text-sm text-gray-600">
                {zombie.watch_count || 0}
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {filteredZombies.length > 0 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          {/* Left: Page info (moved from center) */}
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredZombies.length)} of {filteredZombies.length} listings
            {searchQuery && ` (filtered from ${zombies.length} total)`}
          </div>


          {/* Right: Navigation buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
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
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default ZombieTable

