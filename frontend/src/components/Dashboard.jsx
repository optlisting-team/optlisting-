import { useState, useEffect } from 'react'
import axios from 'axios'
import { useStore } from '../contexts/StoreContext'
import SummaryCard from './SummaryCard'
import ZombieTable from './ZombieTable'
import FilterBar from './FilterBar'
import DeleteQueue from './DeleteQueue'
import HistoryTable from './HistoryTable'
import QueueReviewPanel from './QueueReviewPanel'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const CURRENT_USER_ID = "default-user" // Temporary user ID for MVP phase

function Dashboard() {
  const { selectedStore } = useStore()
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
    supplier_filter: 'All'
  })

  const fetchZombies = async (filterParams = filters) => {
    try {
      setLoading(true)
      // Build params object - ALWAYS include store_id
      const params = {
        user_id: CURRENT_USER_ID,
        store_id: selectedStore?.id || 'all', // Always include store_id (even if 'all')
        marketplace: filterParams.marketplace_filter || 'All',
        min_days: filterParams.min_days,
        max_sales: filterParams.max_sales,
        max_watch_count: filterParams.max_watch_count,
        supplier_filter: filterParams.supplier_filter || filterParams.source_filter
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/analyze`, { params })
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
        // Build params object - ALWAYS include store_id
        const listingsParams = {
          user_id: CURRENT_USER_ID,
          store_id: selectedStore?.id || 'all', // Always include store_id (even if 'all')
          skip: 0,
          limit: 10000 // Get all listings
        }
        
        const listingsResponse = await axios.get(`${API_BASE_URL}/api/listings`, {
          params: listingsParams
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
            user_id: CURRENT_USER_ID,
            min_days: 0, // No filter
            max_sales: 999999, // No filter
            max_watch_count: 999999, // No filter
            supplier_filter: 'All',
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

  const handleSelectAll = (checkedOrIds) => {
    // Support both boolean (legacy) and array (new pagination mode)
    if (Array.isArray(checkedOrIds)) {
      setSelectedIds(checkedOrIds)
    } else {
      const currentData = viewMode === 'all' ? allListings : viewMode === 'queue' ? queue : zombies
      if (checkedOrIds) {
        setSelectedIds(currentData.map(item => item.id))
      } else {
        setSelectedIds([])
      }
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

  const handleSourceChange = async (itemId, newSupplier) => {
    try {
      // Step 1: Update in backend database
      await axios.patch(`${API_BASE_URL}/api/listing/${itemId}`, {
        supplier: newSupplier
      })

      // Step 2: Update in local state (candidates/zombies/allListings)
      const updateItemInList = (list) => {
        return list.map(item => 
          item.id === itemId ? { ...item, supplier: newSupplier, supplier_name: newSupplier } : item
        )
      }

      if (viewMode === 'all') {
        setAllListings(updateItemInList(allListings))
      } else if (viewMode === 'zombies') {
        setZombies(updateItemInList(zombies))
      }

      // Step 3: If item is in queue, update it there too (will auto-regroup by supplier)
      const itemInQueue = queue.find(item => item.id === itemId)
      if (itemInQueue) {
        setQueue(updateItemInList(queue))
        // Note: QueueReviewPanel automatically regroups by supplier, so the item will move to the correct group
      }

      console.log(`Supplier updated for item ${itemId}: ${newSupplier}`)
    } catch (err) {
      console.error('Failed to update source:', err)
      alert('Failed to update source. Please try again.')
      // Optionally: revert the change in UI if backend update fails
    }
  }

  // Fetch data when store changes - CRITICAL: This ensures data updates when store is switched
  useEffect(() => {
    if (selectedStore) {
      console.log('Store changed to:', selectedStore.id, '- Refetching data...')
      fetchZombies()
      fetchAllListings()
    }
  }, [selectedStore?.id]) // Only depend on store ID to avoid unnecessary re-renders

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
    <div className="font-sans bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
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
        <div className={`flex gap-8 transition-all duration-300 ${
          viewMode === 'all' ? '' : ''
        }`}>
          {/* Left Column - Dynamic Width */}
          <div className={`space-y-8 transition-all duration-300 ${
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
              <Card className="mb-4">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    📋 <strong className="text-foreground">Viewing All Listings</strong> - Click "Low Interest Detected" card to filter and optimize inventory.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Briefing Text for Low Interest Items View */}
            {viewMode === 'zombies' && (
              <Card className="mb-4">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    🔍 <strong className="text-foreground">Current Filter:</strong> Showing {filters.marketplace_filter === 'All' ? <strong className="text-foreground">All Platforms</strong> : <strong className="text-foreground">[{filters.marketplace_filter}]</strong>} listings older than <strong className="text-foreground">{filters.min_days} days</strong> with <strong className="text-foreground">{filters.max_sales} sales</strong> and <strong className="text-foreground">≤ {filters.max_watch_count} views</strong>. These items have low customer interest and may need optimization.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Briefing Text for Queue View */}
            {viewMode === 'queue' && (
              <Card className="mb-4">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    ✅ <strong className="text-foreground">Full-Screen Final Review Mode</strong> - Review all items grouped by source. Each section has its own download button.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Briefing Text for History View */}
            {viewMode === 'history' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-4">
                <p className="text-sm text-slate-700">
                  💀 <strong>Deletion History</strong> - View all items that have been exported for deletion. This is your permanent record.
                </p>
              </div>
            )}

            {/* Bulk Action Bar - Show for zombies view only (queue uses QueueReviewPanel) */}
            {viewMode === 'zombies' && zombies.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-4">
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
                  <Button
                    onClick={handleAddToQueue}
                    disabled={selectedIds.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <span>Add Selected to Queue</span>
                    <span className="text-lg">➡️</span>
                    {selectedIds.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-green-700 rounded text-xs font-bold">
                        {selectedIds.length}
                      </span>
                    )}
                  </Button>
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {viewMode === 'history' ? (
                  <div className="p-6">
                    <HistoryTable logs={historyLogs} loading={loading} />
                  </div>
                ) : loading ? (
                  <div className="p-8 text-center text-slate-500">
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
                      <div className="p-8 text-center text-slate-500">
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
                    <div className="p-6">
                      <ZombieTable 
                        zombies={currentData}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                        onSourceChange={handleSourceChange}
                      />
                    </div>
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

