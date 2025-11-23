import React, { useState, useEffect } from 'react'
import SourceBadge from './SourceBadge'
import PlatformBadge from './PlatformBadge'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Available export tools
const EXPORT_TOOLS = [
  { value: 'autods', label: 'AutoDS' },
  { value: 'yaballe', label: 'Yaballe' },
  { value: 'shopify_matrixify', label: 'Shopify (Matrixify)' },
  { value: 'shopify_tagging', label: 'Shopify (Tagging)' },
  { value: 'wholesale2b', label: 'Wholesale2B' },
  { value: 'ebay', label: 'eBay Direct' }
]

// Tool display names for download button
const TOOL_DISPLAY_NAMES = {
  'autods': 'AutoDS',
  'yaballe': 'Yaballe',
  'shopify_matrixify': 'Shopify Matrixify',
  'shopify_tagging': 'Shopify Tagging',
  'wholesale2b': 'Wholesale2B',
  'ebay': 'eBay Direct'
}

function QueueReviewPanel({ queue, onRemove, onExportComplete, onHistoryUpdate, onSourceChange }) {
  // Tool mapping state: { "Amazon": "autods", "Walmart": "wholesale2b", ... }
  const [toolMapping, setToolMapping] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('optlisting_tool_mapping')
    return saved ? JSON.parse(saved) : {}
  })
  
  // Full sync mode state: { "Amazon": false, "Walmart": true, ... }
  const [fullSyncMode, setFullSyncMode] = useState(() => {
    const saved = localStorage.getItem('optlisting_full_sync_mode')
    return saved ? JSON.parse(saved) : {}
  })

  // Save to localStorage whenever toolMapping changes
  useEffect(() => {
    localStorage.setItem('optlisting_tool_mapping', JSON.stringify(toolMapping))
  }, [toolMapping])
  
  // Save to localStorage whenever fullSyncMode changes
  useEffect(() => {
    localStorage.setItem('optlisting_full_sync_mode', JSON.stringify(fullSyncMode))
  }, [fullSyncMode])

  // Group items by supplier
  const groupedBySource = queue.reduce((acc, item) => {
    const source = item.supplier_name || item.supplier || item.source_name || item.source || 'Unknown'
    if (!acc[source]) {
      acc[source] = []
    }
    acc[source].push(item)
    return acc
  }, {})

  // Get tool for a source (with default fallback)
  const getToolForSource = (source) => {
    return toolMapping[source] || 'autods' // Default to AutoDS
  }

  // Update tool for a source
  const updateToolForSource = (source, tool) => {
    setToolMapping(prev => ({
      ...prev,
      [source]: tool
    }))
  }

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

  const handleSourceExport = async (source, items, targetTool) => {
    if (items.length === 0) {
      alert(`No ${source} items in queue to export.`)
      return
    }

    if (!targetTool) {
      alert(`Please select an export tool for ${source} items.`)
      return
    }

    try {
      // Determine export mode
      const isFullSync = fullSyncMode[source] || false
      const mode = isFullSync ? 'full_sync_list' : 'delete_list'
      
      // Log deletion only for delete_list mode
      if (mode === 'delete_list') {
        try {
          await axios.post(`${API_BASE_URL}/api/log-deletion`, {
            items: items
          })
        } catch (logErr) {
          console.error('Failed to log deletion:', logErr)
        }
      }

      // Export CSV with target_tool and mode parameters
      const response = await axios.post(
        `${API_BASE_URL}/api/export-queue`,
        {
          items: items,
          target_tool: targetTool,
          mode: mode
        },
        {
          responseType: 'blob'
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const sourceLower = source.toLowerCase().replace(/\s+/g, '_')
      const toolName = TOOL_DISPLAY_NAMES[targetTool] || targetTool
      const fileType = isFullSync ? 'survivors' : 'delete'
      link.setAttribute('download', `${sourceLower}_${toolName}_${fileType}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Notify parent to remove exported items and update history (only for delete_list mode)
      if (onExportComplete && mode === 'delete_list') {
        onExportComplete(items.map(item => item.id))
      }
      
      // Update history count
      if (onHistoryUpdate) {
        onHistoryUpdate()
      }
    } catch (err) {
      alert(`Failed to export ${source} CSV for ${TOOL_DISPLAY_NAMES[targetTool] || targetTool}`)
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
      case 'CJ Dropshipping':
        return {
          headerBg: 'bg-gray-800',
          headerText: 'text-white',
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          buttonBg: 'bg-gray-800',
          buttonHover: 'hover:bg-gray-900'
        }
      // Pro Dropshipping Aggregators - High-Volume Sellers
      case 'Wholesale2B':
        return {
          headerBg: 'bg-blue-700',
          headerText: 'text-white',
          border: 'border-blue-500',
          bg: 'bg-blue-50',
          buttonBg: 'bg-blue-700',
          buttonHover: 'hover:bg-blue-800'
        }
      case 'Doba':
        return {
          headerBg: 'bg-teal-500',
          headerText: 'text-white',
          border: 'border-teal-300',
          bg: 'bg-teal-50',
          buttonBg: 'bg-teal-500',
          buttonHover: 'hover:bg-teal-600'
        }
      case 'DSers':
        return {
          headerBg: 'bg-rose-500',
          headerText: 'text-white',
          border: 'border-rose-300',
          bg: 'bg-rose-50',
          buttonBg: 'bg-rose-500',
          buttonHover: 'hover:bg-rose-600'
        }
      case 'Spocket':
        return {
          headerBg: 'bg-purple-600',
          headerText: 'text-white',
          border: 'border-purple-400',
          bg: 'bg-purple-50',
          buttonBg: 'bg-purple-600',
          buttonHover: 'hover:bg-purple-700'
        }
      case 'Unverified':
        return {
          headerBg: 'bg-amber-500',
          headerText: 'text-white',
          border: 'border-amber-300',
          bg: 'bg-amber-50',
          buttonBg: 'bg-gray-400',
          buttonHover: 'hover:bg-gray-400'
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
          Add items from the low interest items list to review them here.
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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">
                  {source.toUpperCase()} - {items.length} Item{items.length !== 1 ? 's' : ''}
                </h2>
                <SourceBadge source={source} />
              </div>
              {/* Tool Selection Dropdown */}
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium opacity-90">via</label>
                <select
                  value={getToolForSource(source)}
                  onChange={(e) => updateToolForSource(source, e.target.value)}
                  className="bg-white text-gray-900 border border-white/20 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {EXPORT_TOOLS.map(tool => (
                    <option key={tool.value} value={tool.value}>
                      {tool.label}
                    </option>
                  ))}
                </select>
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
                      Supplier
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
                        <PlatformBadge marketplace={item.platform || item.marketplace || 'eBay'} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.item_id || item.ebay_item_id}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 max-w-xs truncate" title={item.title}>
                        {item.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SourceBadge 
                          source={item.supplier_name || item.supplier || item.source_name || item.source} 
                          editable={!!onSourceChange}
                          onSourceChange={onSourceChange}
                          itemId={item.id}
                        />
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
              {source === 'Unverified' ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800 mb-1">
                          Supplier Verification Required
                        </p>
                        <p className="text-xs text-amber-700">
                          Please identify the supplier manually to generate the correct CSV. Click on the supplier badges above to verify each item.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-400 text-gray-600 font-bold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>🔒</span>
                    <span>Download Disabled - Verify Suppliers First</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Full Sync Mode Toggle */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={`full-sync-${source}`}
                      checked={fullSyncMode[source] || false}
                      onChange={(e) => {
                        setFullSyncMode(prev => ({
                          ...prev,
                          [source]: e.target.checked
                        }))
                      }}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor={`full-sync-${source}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-700">
                        Export as "Survivor List" (Full Sync Mode)
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Check this if your tool requires re-uploading your full inventory to remove missing items (e.g., old Wholesale2B mode).
                      </div>
                    </label>
                  </div>
                  
                  {/* Download Button */}
                  <button
                    onClick={() => handleSourceExport(source, items, getToolForSource(source))}
                    className={`w-full ${colors.buttonBg} ${colors.buttonHover} text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md`}
                  >
                    <span>📥</span>
                    <span>
                      {fullSyncMode[source] 
                        ? `Download Survivor List for [${TOOL_DISPLAY_NAMES[getToolForSource(source)] || 'Tool'}]`
                        : `Download CSV for [${TOOL_DISPLAY_NAMES[getToolForSource(source)] || 'Tool'}] (${items.length} items)`
                      }
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QueueReviewPanel

