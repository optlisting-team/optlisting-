import React from 'react'
import SourceBadge from './SourceBadge'
import PlatformBadge from './PlatformBadge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table'
import { Card } from './ui/card'

function HistoryTable({ logs, loading }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading deletion history...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">💀</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">No Deletions Yet</p>
        <p className="text-sm text-gray-500">
          Your deletion history will appear here once you export items for deletion.
        </p>
      </div>
    )
  }

  return (
    <Card className="w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-medium uppercase tracking-wider">
              Deleted On
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider">
              Platform
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider">
              Item ID
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider max-w-xs">
              Title
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider">
              Supplier
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDateTime(log.deleted_at)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <PlatformBadge marketplace={log.platform || 'eBay'} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm font-mono">
                {log.item_id}
              </TableCell>
              <TableCell className="text-sm font-semibold max-w-xs truncate" title={log.title}>
                {log.title}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <SourceBadge source={log.source} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default HistoryTable

