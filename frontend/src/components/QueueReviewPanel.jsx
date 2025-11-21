import React from 'react'
import SourceBadge from './SourceBadge'
import PlatformBadge from './PlatformBadge'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

function QueueReviewPanel({ queue, onRemove, onExportComplete, onHistoryUpdate }) {
  // Group items by source
  const groupedBySource = queue.reduce((acc, item) => {
    if (!acc[item.source]) {
      acc[item.source] = []
    }
    acc[item.source].push(item)
    return acc
  }, {})

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleSourceExport = async (source, items) => {
    if (items.length === 0) {
      alert(`No ${source} items in queue to export.`)
      return
    }

    try {
      // Log deletion first
      try {
        await axios.post(`${API_BASE_URL}/api/log-deletion`, {
          items: items
        })
      } catch (logErr) {
        console.error('Failed to log deletion:', logErr)
      }

      // Export CSV
      const response = await axios.post(
        `${API_BASE_URL}/api/export-queue`,
        {
          items: items,
          export_mode: 'autods'
        },
        {
          responseType: 'blob'
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const sourceLower = source.toLowerCase()
      link.setAttribute('download', `${sourceLower}_delete.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Notify parent to remove exported items and update history
      if (onExportComplete) {
        onExportComplete(items.map(item => item.id))
      }
      
      // Update history count
      if (onHistoryUpdate) {
        onHistoryUpdate()
      }
    } catch (err) {
      alert(`Failed to export ${source} CSV`)
      console.error(err)
    }
  }

  const getSourceColor = (source) => {
    switch (source) {
      case 'Amazon':
        return {
          headerBg: 'bg-orange-600',
          headerText: 'text-white',
          border: 'border-orange-300',
          bg: 'bg-orange-50',
          buttonBg: 'bg-orange-600',
          buttonHover: 'hover:bg-orange-700'
        }
      case 'Walmart':
        return {
          headerBg: 'bg-blue-600',
          headerText: 'text-white',
          border: 'border-blue-300',
          bg: 'bg-blue-50',
          buttonBg: 'bg-blue-600',
          buttonHover: 'hover:bg-blue-700'
        }
      case 'AliExpress':
        return {
          headerBg: 'bg-red-600',
          headerText: 'text-white',
          border: 'border-red-300',
          bg: 'bg-red-50',
          buttonBg: 'bg-red-600',
          buttonHover: 'hover:bg-red-700'
        }
      case 'CJ Dropshipping':
        return {
          headerBg: 'bg-gray-800',
          headerText: 'text-white',
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          buttonBg: 'bg-gray-800',
          buttonHover: 'hover:bg-gray-900'
        }
      case 'Home Depot':
        return {
          headerBg: 'bg-orange-500',
          headerText: 'text-white',
          border: 'border-orange-300',
          bg: 'bg-orange-50',
          buttonBg: 'bg-orange-500',
          buttonHover: 'hover:bg-orange-600'
        }
      case 'Wayfair':
        return {
          headerBg: 'bg-violet-600',
          headerText: 'text-white',
          border: 'border-violet-300',
          bg: 'bg-violet-50',
          buttonBg: 'bg-violet-600',
          buttonHover: 'hover:bg-violet-700'
        }
      case 'Costco':
        return {
          headerBg: 'bg-blue-500',
          headerText: 'text-white',
          border: 'border-blue-300',
          bg: 'bg-blue-50',
          buttonBg: 'bg-blue-500',
          buttonHover: 'hover:bg-blue-600'
        }
      default:
        return {
          headerBg: 'bg-gray-600',
          headerText: 'text-white',
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          buttonBg: 'bg-gray-600',
          buttonHover: 'hover:bg-gray-700'
        }
    }
  }

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-4xl mb-4">🗑️</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">No Items in Queue</p>
        <p className="text-sm text-gray-500">
          Add items from the zombies list to review them here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {Object.entries(groupedBySource).map(([source, items]) => {
        const colors = getSourceColor(source)
        
        return (
          <div
            key={source}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`${colors.headerBg} ${colors.headerText} px-6 py-4 flex-shrink-0`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {source.toUpperCase()} - {items.length} Item{items.length !== 1 ? 's' : ''}
                </h2>
                <SourceBadge source={source} />
              </div>
            </div>

            {/* Table Area (Scrollable Body) */}
            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-96 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PlatformBadge marketplace={item.marketplace || 'eBay'} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.ebay_item_id}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 max-w-xs truncate" title={item.title}>
                        {item.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer (Download Button) */}
            <div className="bg-gray-50 px-4 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => handleSourceExport(source, items)}
                className={`w-full ${colors.buttonBg} ${colors.buttonHover} text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md`}
              >
                <span>📥</span>
                <span>Download {source} CSV ({items.length} items)</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QueueReviewPanel

