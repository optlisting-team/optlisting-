import { useState, useRef, useEffect } from 'react'

const AVAILABLE_SOURCES = [
  'Amazon',
  'Walmart',
  'Wholesale2B',
  'Doba',
  'DSers',
  'Spocket',
  'CJ Dropshipping',
  'Unverified',
  'Unknown'
]

function SourceBadge({ source, editable = false, onSourceChange = null, itemId = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSource, setCurrentSource] = useState(source)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Update current source when prop changes
  useEffect(() => {
    setCurrentSource(source)
    // Auto-open dropdown if source is Unverified (requires action)
    if (source === 'Unverified' && editable) {
      setIsOpen(true)
    }
  }, [source, editable])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter sources based on search query
  const filteredSources = AVAILABLE_SOURCES.filter(src =>
    src.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getBadgeColor = (source) => {
    switch (source) {
      case 'Amazon':
        return 'bg-yellow-50 text-yellow-700'
      case 'Walmart':
        return 'bg-cyan-50 text-cyan-700'
      // Pro Dropshipping Aggregators - High-Volume Sellers
      case 'Wholesale2B':
        return 'bg-blue-700 text-white'
      case 'Doba':
        return 'bg-teal-500 text-white'
      case 'DSers':
        return 'bg-rose-500 text-white'
      case 'Spocket':
        return 'bg-purple-600 text-white'
      case 'CJ Dropshipping':
        return 'bg-gray-800 text-white'
      case 'Unverified':
        return 'bg-amber-100 text-amber-800 border border-amber-300'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  const handleSourceSelect = async (newSource) => {
    if (newSource === currentSource) {
      setIsOpen(false)
      setSearchQuery('')
      return
    }

    setCurrentSource(newSource)
    setIsOpen(false)
    setSearchQuery('')

    // Call parent handler if provided
    if (onSourceChange && itemId) {
      await onSourceChange(itemId, newSource)
    }
  }

  const handleToggle = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (!newIsOpen) {
      setSearchQuery('')
    }
  }

  if (!editable) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
          currentSource
        )}`}
      >
        {currentSource === 'Unverified' && <span>⚠️</span>}
        {currentSource}
      </span>
    )
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
          currentSource
        )} hover:opacity-80 transition-opacity cursor-pointer`}
        title={currentSource === 'Unverified' ? '⚠️ Source needs verification - Click to identify' : 'Click to change source'}
      >
        {currentSource === 'Unverified' && <span className="text-xs">⚠️</span>}
        <span>{currentSource === 'Unverified' ? 'Unverified' : currentSource}</span>
        <span className="text-[10px] opacity-70">✏️</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
          {/* Search Input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 rounded-t-lg">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Scrollable List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredSources.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No sources found
              </div>
            ) : (
              filteredSources.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => handleSourceSelect(src)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between ${
                    src === currentSource ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(src)}`}>
                      {src}
                    </span>
                  </div>
                  {src === currentSource && (
                    <span className="text-blue-600 font-semibold">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SourceBadge

