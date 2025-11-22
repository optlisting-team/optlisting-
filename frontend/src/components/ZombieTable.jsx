import SourceBadge from './SourceBadge'
import PlatformBadge from './PlatformBadge'

function ZombieTable({ zombies, selectedIds, onSelect, onSelectAll, onSourceChange }) {
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

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedIds.length === zombies.length && zombies.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            <tr key={zombie.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(zombie.id)}
                  onChange={(e) => onSelect(zombie.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

