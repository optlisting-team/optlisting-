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

  const getManagementHubTooltip = (listing) => {
    const platform = listing.marketplace || 'eBay'
    const managementHub = listing.management_hub

    if (managementHub === 'Shopify') {
      return `Listed on ${platform}, Managed by Shopify Hub.`
    } else if (managementHub === 'eBay Direct') {
      return 'Direct listing via eBay File Exchange.'
    } else if (managementHub === null || managementHub === undefined || managementHub === 'self' || managementHub === 'OptListing') {
      return 'Managed directly by OptListing.'
    } else {
      // Fallback for any other management hub values
      return `Listed on ${platform}, Managed by ${managementHub}.`
    }
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
    <div className="w-full border border-zinc-800 dark:border-zinc-800 rounded-lg overflow-x-auto bg-zinc-900 dark:bg-zinc-900">
      <table className="min-w-full divide-y divide-zinc-800 dark:divide-zinc-800">
        <thead className="bg-zinc-900 dark:bg-zinc-900 border-b border-zinc-800 dark:border-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedIds.length === zombies.length && zombies.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-zinc-700 dark:border-zinc-700 text-white dark:text-white focus:ring-white dark:focus:ring-white bg-zinc-800 dark:bg-zinc-800"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              Platform
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              eBay Item ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider max-w-xs">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              Date Listed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
              Watch Count
            </th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900 dark:bg-zinc-900 divide-y divide-zinc-800 dark:divide-zinc-800">
          {zombies.map((zombie) => (
            <tr key={zombie.id} className="hover:bg-zinc-800 dark:hover:bg-zinc-800 transition-colors">
              <td className="w-10 px-4 py-5 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-zinc-700 dark:border-zinc-700 text-white dark:text-white focus:ring-white dark:focus:ring-white bg-zinc-800 dark:bg-zinc-800"
                />
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="relative group inline-block">
                  <PlatformBadge marketplace={zombie.marketplace || 'eBay'} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 dark:bg-zinc-800 text-white dark:text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                    {getManagementHubTooltip(zombie)}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800 dark:border-t-zinc-800"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-white dark:text-white">
                {zombie.ebay_item_id}
              </td>
              <td className="px-6 py-5 text-sm font-semibold text-white dark:text-white max-w-xs truncate" title={zombie.title}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="truncate">{zombie.title}</span>
                  {zombie.is_active_elsewhere && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 flex-shrink-0" title="Active Elsewhere - This item is performing well in another store/platform. Manual review required before deletion.">
                      🔴 Active Elsewhere - Manual Review Required
                    </span>
                  )}
                  {zombie.is_global_winner && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0" title="Global Winner - Selling well across all platforms. Review before deleting.">
                      ⚠️ Global Winner - Review
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <SourceBadge 
                  source={zombie.supplier_name || zombie.supplier || "Unknown"} 
                  editable={!!onSourceChange}
                  onSourceChange={onSourceChange}
                  itemId={zombie.id}
                />
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-zinc-400 dark:text-zinc-400">
                {zombie.sku}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-white dark:text-white">
                {formatPrice(zombie.price)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-zinc-400 dark:text-zinc-400">
                {formatDate(zombie.date_listed)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-zinc-400 dark:text-zinc-400">
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

