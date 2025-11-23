import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, Eye, Pencil } from "lucide-react"
import SourceBadge from './SourceBadge'

export function OrdersTable({ 
  listings = [], 
  selectedIds = [], 
  onSelect, 
  onSelectAll, 
  onSourceChange,
  loading = false 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)

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
    if (!price) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  // Filter listings based on search query
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings
    
    const query = searchQuery.toLowerCase()
    return listings.filter(item => {
      const title = (item.title || '').toLowerCase()
      const sku = (item.sku || '').toLowerCase()
      const itemId = ((item.ebay_item_id || item.item_id) || '').toLowerCase()
      
      return title.includes(query) || sku.includes(query) || itemId.includes(query)
    })
  }, [listings, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const visibleListings = filteredListings.slice(startIndex, endIndex)

  // Handle select all for current page
  const handleSelectAllPage = (checked) => {
    if (onSelectAll) {
      if (checked) {
        const pageIds = visibleListings.map(item => item.id)
        const newSelectedIds = [...new Set([...selectedIds, ...pageIds])]
        onSelectAll(newSelectedIds)
      } else {
        const pageIds = visibleListings.map(item => item.id)
        const newSelectedIds = selectedIds.filter(id => !pageIds.includes(id))
        onSelectAll(newSelectedIds)
      }
    }
  }

  const allVisibleSelected = visibleListings.length > 0 && visibleListings.every(item => selectedIds.includes(item.id))
  const someVisibleSelected = visibleListings.some(item => selectedIds.includes(item.id))

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select 
            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-xs"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-muted-foreground">items</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search in results..."
              className="pl-8 h-9 text-sm bg-muted/20 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 border-border/50 bg-muted/20">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-muted/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
              <TableHead className="w-[40px]">
                <Checkbox 
                  className="border-muted-foreground/50"
                  checked={allVisibleSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someVisibleSelected && !allVisibleSelected
                  }}
                  onCheckedChange={handleSelectAllPage}
                />
              </TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date Listed</TableHead>
              <TableHead className="text-right">Watch Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : visibleListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? `No items found matching "${searchQuery}"` : 'No listings found'}
                </TableCell>
              </TableRow>
            ) : (
              visibleListings.map((item) => {
                const platform = item.marketplace || item.platform || 'eBay'
                const itemId = item.ebay_item_id || item.item_id || item.id
                return (
                  <TableRow key={item.id} className="hover:bg-muted/40 border-border/50">
                    <TableCell>
                      <Checkbox 
                        className="border-muted-foreground/50"
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => onSelect && onSelect(item.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-background border border-border/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          {platform[0]}
                        </div>
                        <span className="font-medium text-sm">{platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {String(itemId).substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm truncate max-w-[200px] block" title={item.title}>
                        {item.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <SourceBadge 
                        source={item.supplier_name || item.supplier || item.source_name || item.source || 'Unknown'}
                        editable={!!onSourceChange}
                        onSourceChange={onSourceChange}
                        itemId={item.id}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.sku || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-sm">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(item.date_listed)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-sm">{item.watch_count || 0}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-muted-foreground">
          Selected {selectedIds.length} of {filteredListings.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-transparent" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs bg-transparent"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

