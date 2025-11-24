import SourceBadge from './SourceBadge'
import ExportButton from './ExportButton'

function QueueList({ queue, onRemove, onExport, loading }) {
  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Ready to Export (Final Check)
        </h3>
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-center">
            No items in queue.<br />
            Select items from the left to add them here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6 h-full border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Ready to Export (Final Check)
        </h3>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          {queue.length} item{queue.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <ExportButton onExport={onExport} />
      </div>

      {/* Queue Items List */}
      <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
        {queue.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                      <SourceBadge source={item.supplier_name || item.supplier || "Unknown"} />
                      <span className="font-mono">{item.sku}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {item.ebay_item_id}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove from queue"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QueueList

