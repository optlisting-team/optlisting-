function SourceBadge({ source }) {
  const getBadgeColor = (source) => {
    switch (source) {
      case 'Amazon':
        return 'bg-orange-100 text-orange-800'
      case 'Walmart':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

