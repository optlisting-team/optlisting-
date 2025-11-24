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
    <div className="w-full border border-gray-300 rounded-lg overflow-x-auto bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white border-b border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedIds.length === zombies.length && zombies.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              eBay Item ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Listed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Watch Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {zombies.map((zombie) => (
            <tr key={zombie.id} className="hover:bg-zinc-50 transition-colors">
              <td className="w-10 px-4 py-5 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <PlatformBadge marketplace={zombie.marketplace || 'eBay'} />
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-900">
                {zombie.ebay_item_id}
              </td>
              <td className="px-6 py-5 text-sm font-semibold text-gray-900 max-w-xs truncate" title={zombie.title}>
                {zombie.title}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <SourceBadge 
                  source={zombie.source} 
                  editable={!!onSourceChange}
                  onSourceChange={onSourceChange}
                  itemId={zombie.id}
                />
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                {zombie.sku}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(zombie.price)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                {formatDate(zombie.date_listed)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                {zombie.watch_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ZombieTable

