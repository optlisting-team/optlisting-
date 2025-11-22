import { useState, useEffect } from 'react'
import axios from 'axios'
import SummaryCard from './SummaryCard'
import ZombieTable from './ZombieTable'
import FilterBar from './FilterBar'
import DeleteQueue from './DeleteQueue'
import HistoryTable from './HistoryTable'
import QueueReviewPanel from './QueueReviewPanel'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Dashboard() {
  const [zombies, setZombies] = useState([])
  const [allListings, setAllListings] = useState([]) // All listings for 'all' view mode
  const [totalZombies, setTotalZombies] = useState(0)
  const [totalListings, setTotalListings] = useState(0)
  const [totalBreakdown, setTotalBreakdown] = useState({ Amazon: 0, Walmart: 0, Unknown: 0 })
  const [platformBreakdown, setPlatformBreakdown] = useState({ eBay: 0, Amazon: 0, Shopify: 0, Walmart: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [queue, setQueue] = useState([])
  const [viewMode, setViewMode] = useState('all') // 'all', 'zombies', 'queue', or 'history' - Default to 'all' for monitoring
  const [historyLogs, setHistoryLogs] = useState([])
  const [totalDeleted, setTotalDeleted] = useState(0)
  const [filters, setFilters] = useState({
    marketplace_filter: 'All',
    min_days: 3,
    max_sales: 0,
    max_watch_count: 10,
    source_filter: 'All'
  })

  const fetchZombies = async (filterParams = filters) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/analyze`, {
        params: {
          marketplace: filterParams.marketplace_filter || 'All',
          min_days: filterParams.min_days,
          max_sales: filterParams.max_sales,
          max_watch_count: filterParams.max_watch_count,
          source_filter: filterParams.source_filter
        }
      })
      setZombies(response.data.zombies)
      setTotalZombies(response.data.zombie_count)
      // Update total stats from API response
      setTotalListings(response.data.total_count || 0)
      const breakdown = response.data.total_breakdown || { Amazon: 0, Walmart: 0, Unknown: 0 }
      setTotalBreakdown(breakdown)
      const platformBreakdown = response.data.platform_breakdown || { eBay: 0, Amazon: 0, Shopify: 0, Walmart: 0 }
      setPlatformBreakdown(platformBreakdown)
      console.log('Total Breakdown:', breakdown) // Debug log
      console.log('Platform Breakdown:', platformBreakdown) // Debug log
      setError(null)
    } catch (err) {
      setError('Failed to fetch low interest listings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch listings
      try {
        const listingsResponse = await axios.get(`${API_BASE_URL}/api/listings`, {
          params: {
            skip: 0,
            limit: 10000 // Get all listings
          }
        })
        setAllListings(listingsResponse.data.listings || [])
      } catch (listingsErr) {
        console.error('Failed to fetch listings:', listingsErr)
        // Continue even if listings fail, try to get stats
      }
      
      // Fetch total stats from analyze endpoint (without filters to get all data)
      try {
        const statsResponse = await axios.get(`${API_BASE_URL}/api/analyze`, {
          params: {
            min_days: 0, // No filter
            max_sales: 999999, // No filter
            max_watch_count: 999999, // No filter
            source_filter: 'All',
            marketplace: 'All'
          }
        })
        
        // Update total stats
        setTotalListings(statsResponse.data.total_count || 0)
        const breakdown = statsResponse.data.total_breakdown || {}
        setTotalBreakdown(breakdown)
        const platformBreakdown = statsResponse.data.platform_breakdown || {}
        setPlatformBreakdown(platformBreakdown)
      } catch (statsErr) {
        console.error('Failed to fetch stats:', statsErr)
        // If stats fail but listings succeeded, use listings total
        if (allListings.length > 0) {
          setTotalListings(allListings.length)
        }
      }
      
    } catch (err) {
      setError('Failed to fetch all listings')
      console.error('fetchAllListings error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      // Don't set loading to true here to avoid blocking other operations
      const response = await axios.get(`${API_BASE_URL}/api/history`, {
        params: {
          skip: 0,
          limit: 10000
        }
      })
      setHistoryLogs(response.data.logs || [])
      setTotalDeleted(response.data.total_count || 0)
    } catch (err) {
      // Don't set global error, just log it
      console.error('Failed to fetch deletion history:', err)
      setHistoryLogs([])
      setTotalDeleted(0)
    }
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setSelectedIds([]) // Reset selection when switching views
    if (mode === 'all') {
      fetchAllListings()
    } else if (mode === 'zombies') {
      fetchZombies()
    } else if (mode === 'history') {
      fetchHistory()
    }
    // 'queue' mode doesn't need to fetch data, it uses existing queue state
  }

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters)
    setSelectedIds([]) // Reset selection when filters change
    fetchZombies(newFilters)
  }

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  const handleSelectAll = (checked) => {
    const currentData = viewMode === 'all' ? allListings : viewMode === 'queue' ? queue : zombies
    if (checked) {
      setSelectedIds(currentData.map(item => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleAddToQueue = () => {
    // Only allow adding to queue from zombies view
    if (viewMode !== 'zombies') return
    
    const selectedItems = zombies.filter(z => selectedIds.includes(z.id))
    setQueue([...queue, ...selectedItems])
    // Remove selected items from candidates (visually)
    setZombies(zombies.filter(z => !selectedIds.includes(z.id)))
    setSelectedIds([])
    setTotalZombies(totalZombies - selectedItems.length)
  }

  const handleRemoveFromQueueBulk = () => {
    // Remove selected items from queue (restore to candidates)
    if (viewMode !== 'queue') return
    
    const selectedItems = queue.filter(q => selectedIds.includes(q.id))
    // Add back to zombies list
    setZombies([...zombies, ...selectedItems])
    // Remove from queue
    setQueue(queue.filter(q => !selectedIds.includes(q.id)))
    setSelectedIds([])
    setTotalZombies(totalZombies + selectedItems.length)
  }

  const handleRemoveFromQueue = (id) => {
    setQueue(queue.filter(item => item.id !== id))
  }

  const handleSourceChange = async (itemId, newSource) => {
    try {
      // Step 1: Update in backend database
      await axios.patch(`${API_BASE_URL}/api/listing/${itemId}`, {
        source: newSource
      })

      // Step 2: Update in local state (candidates/zombies/allListings)
      const updateItemInList = (list) => {
        return list.map(item => 
          item.id === itemId ? { ...item, source: newSource } : item
        )
      }

      if (viewMode === 'all') {
        setAllListings(updateItemInList(allListings))
      } else if (viewMode === 'zombies') {
        setZombies(updateItemInList(zombies))
      }

      // Step 3: If item is in queue, update it there too (will auto-regroup by source)
      const itemInQueue = queue.find(item => item.id === itemId)
      if (itemInQueue) {
        setQueue(updateItemInList(queue))
        // Note: QueueReviewPanel automatically regroups by source, so the item will move to the correct group
      }

      console.log(`Source updated for item ${itemId}: ${newSource}`)
    } catch (err) {
      console.error('Failed to update source:', err)
      alert('Failed to update source. Please try again.')
      // Optionally: revert the change in UI if backend update fails
    }
  }

  useEffect(() => {
    // Default to 'all' view on initial load
    fetchAllListings()
    // Fetch history separately (non-blocking)
    fetchHistory().catch(err => {
      console.error('History fetch error on mount:', err)
    })
  }, [])

  const handleExport = async (mode, itemsToExport = null) => {
    // Use provided items or default to full queue
    const items = itemsToExport || queue
    
    if (items.length === 0) {
      alert('No items to export. Please add items to the queue first.')
      return
    }

    try {
      // Step 1: Log deletion to history BEFORE exporting
      try {
        await axios.post(`${API_BASE_URL}/api/log-deletion`, {
          items: items
        })
        // Refresh total deleted count
        const historyResponse = await axios.get(`${API_BASE_URL}/api/history`, {
          params: { skip: 0, limit: 1 }
        })
        setTotalDeleted(historyResponse.data.total_count || 0)
      } catch (logErr) {
        console.error('Failed to log deletion:', logErr)
        // Continue with export even if logging fails
      }

      // Step 2: Export CSV
      const response = await axios.post(
        `${API_BASE_URL}/api/export-queue`,
        {
          items: items,
          export_mode: mode
        },
        {
          responseType: 'blob'
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Determine filename based on source and mode
      const source = items.length > 0 ? items[0].source.toLowerCase() : 'all'
      const filenameMap = {
        autods: `${source}_delete.csv`,
        yaballe: `${source}_delete_yaballe.csv`,
        ebay: `${source}_delete_ebay.csv`
      }
      
      link.setAttribute('download', filenameMap[mode])
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Step 3: Remove exported items from queue
      const exportedIds = items.map(item => item.id)
      setQueue(queue.filter(item => !exportedIds.includes(item.id)))
    } catch (err) {
      alert('Failed to export CSV')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">

        {/* Summary Card */}
        <div className="mb-8">
          <SummaryCard 
            totalListings={totalListings}
            totalBreakdown={totalBreakdown}
            platformBreakdown={platformBreakdown}
            totalZombies={totalZombies} 
            queueCount={queue.length}
            totalDeleted={totalDeleted}
            loading={loading}
            filters={filters}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>

        {/* Dynamic Layout: Full Width for 'all', Split View for 'zombies' */}
        <div className={`flex gap-6 transition-all duration-300 ${
          viewMode === 'all' ? '' : ''
        }`}>
          {/* Left Column - Dynamic Width */}
          <div className={`space-y-4 transition-all duration-300 ${
            (viewMode === 'all' || viewMode === 'history' || viewMode === 'queue')
              ? 'w-full' 
              : 'flex-1 min-w-0'
          }`}>
            {/* Filter Bar - Only show for zombies view */}
            {viewMode === 'zombies' && (
              <FilterBar 
                onApplyFilter={handleApplyFilter}
                loading={loading}
                initialFilters={filters}
              />
            )}

            {/* View Mode Info */}
            {viewMode === 'all' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📋 <strong>Viewing All Listings</strong> - Click "Low Interest Detected" card to filter and optimize inventory.
                </p>
              </div>
            )}

            {/* Briefing Text for Low Interest Items View */}
            {viewMode === 'zombies' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  🔍 <strong>Current Filter:</strong> Showing {filters.marketplace_filter === 'All' ? <strong>All Platforms</strong> : <strong>[{filters.marketplace_filter}]</strong>} listings older than <strong>{filters.min_days} days</strong> with <strong>{filters.max_sales} sales</strong> and <strong>≤ {filters.max_watch_count} views</strong>. These items have low customer interest and may need optimization.
                </p>
              </div>
            )}

            {/* Briefing Text for Queue View */}
            {viewMode === 'queue' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ✅ <strong>Full-Screen Final Review Mode</strong> - Review all items grouped by source. Each section has its own download button.
                </p>
              </div>
            )}

            {/* Briefing Text for History View */}
            {viewMode === 'history' && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-800">
                  💀 <strong>Deletion History</strong> - View all items that have been exported for deletion. This is your permanent record.
                </p>
              </div>
            )}

            {/* Bulk Action Bar - Show for zombies view only (queue uses QueueReviewPanel) */}
            {viewMode === 'zombies' && zombies.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Side: Select All */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          viewMode === 'queue' 
                            ? selectedIds.length === queue.length && queue.length > 0
                            : selectedIds.length === zombies.length && zombies.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All ({viewMode === 'queue' ? queue.length : zombies.length} items)
                      </span>
                    </label>
                    {selectedIds.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                  </div>

                  {/* Right Side: Action Button */}
                  <button
                    onClick={handleAddToQueue}
                    disabled={selectedIds.length === 0}
                    className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                  >
                    <span>Add Selected to Queue</span>
                    <span className="text-lg">➡️</span>
                    {selectedIds.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-green-700 rounded text-xs font-bold">
                        {selectedIds.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Table - Shows different data based on viewMode */}
            {viewMode === 'queue' ? (
              <QueueReviewPanel
                queue={queue}
                onRemove={handleRemoveFromQueue}
                onSourceChange={handleSourceChange}
                onExportComplete={(exportedIds) => {
                  // Remove exported items from queue
                  setQueue(queue.filter(item => !exportedIds.includes(item.id)))
                }}
                onHistoryUpdate={() => {
                  // Refresh history count
                  fetchHistory().catch(err => console.error('History fetch error:', err))
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {viewMode === 'history' ? (
                  <HistoryTable logs={historyLogs} loading={loading} />
                ) : loading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading {viewMode === 'all' ? 'all' : 'low interest'} listings...
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    {error}
                  </div>
                ) : (() => {
                  const currentData = viewMode === 'all' ? allListings : zombies
                  const isEmpty = currentData.length === 0
                  
                  if (isEmpty) {
                    return (
                      <div className="p-8 text-center text-gray-500">
                        {viewMode === 'all' 
                          ? "No listings found."
                          : queue.length > 0 
                            ? "All items have been moved to the queue. Apply new filters to see more candidates."
                            : "No low interest items found! Your inventory is performing well. 🎉"
                        }
                      </div>
                    )
                  }
                  
                  return (
                    <ZombieTable 
                      zombies={currentData}
                      selectedIds={selectedIds}
                      onSelect={handleSelect}
                      onSelectAll={handleSelectAll}
                      onSourceChange={handleSourceChange}
                    />
                  )
                })()}
              </div>
            )}
          </div>

          {/* Right Column (Fixed Width) - Delete Queue - Show in zombies view only */}
          {viewMode === 'zombies' && (
            <div className="w-80 flex-shrink-0 transition-all duration-300">
              <div className="sticky top-4">
                <DeleteQueue
                  queue={queue}
                  onRemove={handleRemoveFromQueue}
                  onExport={handleExport}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

