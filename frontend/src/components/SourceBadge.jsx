function SourceBadge({ source }) {
  const getBadgeColor = (source) => {
    switch (source) {
      case 'AliExpress':
        return 'bg-red-100 text-red-800'
      case 'CJ Dropshipping':
        return 'bg-gray-800 text-white'
      case 'Home Depot':
        return 'bg-orange-100 text-orange-800'
      case 'Wayfair':
        return 'bg-violet-100 text-violet-800'
      case 'Costco':
        return 'bg-blue-50 text-blue-700'
      case 'Amazon':
        return 'bg-yellow-50 text-yellow-700'
      case 'Walmart':
        return 'bg-cyan-50 text-cyan-700'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
        source
      )}`}
    >
      {source}
    </span>
  )
}

export default SourceBadge

