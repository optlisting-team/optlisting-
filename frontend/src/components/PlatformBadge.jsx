function PlatformBadge({ marketplace }) {
  const getBadgeColor = (marketplace) => {
    switch (marketplace) {
      case 'eBay':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Amazon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Shopify':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Walmart':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(
        marketplace
      )}`}
    >
      {marketplace || 'eBay'}
    </span>
  )
}

export default PlatformBadge

