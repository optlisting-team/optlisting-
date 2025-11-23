import SourceBadge from './SourceBadge'
import { Button } from './ui/button'
import { Card } from './ui/card'

function DeleteQueue({ queue, onRemove, onExport, loading }) {
  // Group items by source
  const groupedBySource = queue.reduce((acc, item) => {
    if (!acc[item.source]) {
      acc[item.source] = []
    }
    acc[item.source].push(item)
    return acc
  }, {})

  const amazonItems = groupedBySource.Amazon || []
  const walmartItems = groupedBySource.Walmart || []
  const unknownItems = groupedBySource.Unknown || []

  const handleSourceExport = async (source, mode = 'autods') => {
    // Filter queue items by source
    const sourceItems = queue.filter(item => item.source === source)
    
    if (sourceItems.length === 0) {
      alert(`No ${source} items in queue to export.`)
      return
    }

    // Call export with filtered items
    await onExport(mode, sourceItems)
  }

  const renderSourceSection = (source, items, colorClass, borderClass, bgClass, buttonBgClass) => {
    if (items.length === 0) return null

    return (
      <div className={`rounded-lg border-2 ${borderClass} ${bgClass} p-3 mb-3`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-semibold ${colorClass} uppercase tracking-wide`}>
            {source} ({items.length})
          </h4>
        </div>

        {/* Items List */}
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded p-2 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-2">
                {/* Tiny Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="8"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-gray-900 truncate mb-0.5">
                        {item.title}
                      </h5>
                      <div className="text-xs text-gray-500 font-mono truncate">
                        {item.sku}
                      </div>
                    </div>

                    {/* Remove Button (X) */}
                    <Button
                      onClick={() => onRemove(item.id)}
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Remove from queue"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <Button
          onClick={() => handleSourceExport(source, 'autods')}
          className={`w-full ${buttonBgClass} text-white font-semibold`}
          size="sm"
        >
          <span>Download {source} CSV</span>
          <span className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs font-bold">
            {items.length}
          </span>
        </Button>
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <Card className="p-4 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Ready to Delete
          </h3>
          <p className="text-sm text-muted-foreground">Count: 0</p>
        </div>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-center text-sm">
            No items in queue.<br />
            Select items from the left to add them here.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Ready to Delete
        </h3>
        <p className="text-sm text-muted-foreground">Total: {queue.length} items</p>
      </div>

      {/* Categorized Queue - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {/* Amazon Section */}
        {renderSourceSection(
          'Amazon',
          amazonItems,
          'text-orange-600',
          'border-orange-300',
          'bg-orange-50',
          'bg-orange-600'
        )}

        {/* Walmart Section */}
        {renderSourceSection(
          'Walmart',
          walmartItems,
          'text-blue-600',
          'border-blue-300',
          'bg-blue-50',
          'bg-blue-600'
        )}

        {/* Unknown Section */}
        {renderSourceSection(
          'Unknown',
          unknownItems,
          'text-gray-600',
          'border-gray-300',
          'bg-gray-50',
          'bg-gray-600'
        )}
      </div>
    </div>
  )
}

export default DeleteQueue

