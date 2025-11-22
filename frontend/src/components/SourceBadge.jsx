import { useState, useRef, useEffect } from 'react'

const AVAILABLE_SOURCES = [
  'Amazon',
  'Walmart',
  'AliExpress',
  'CJ Dropshipping',
  'Home Depot',
  'Wayfair',
  'Costco',
  'Wholesale2B',
  'Spocket',
  'SaleHoo',
  'Inventory Source',
  'Dropified',
  'Unverified',
  'Unknown'
]

function SourceBadge({ source, editable = false, onSourceChange = null, itemId = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSource, setCurrentSource] = useState(source)
  const dropdownRef = useRef(null)

  // Update current source when prop changes
  useEffect(() => {
    setCurrentSource(source)
    // Auto-open dropdown if source is Unverified (requires action)
    if (source === 'Unverified' && editable) {
      setIsOpen(true)
    }
  }, [source, editable])

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
      case 'AliExpress':
        return 'bg-red-100 text-red-800'
      case 'CJ Dropshipping':
        return 'bg-gray-800 text-white'
      case 'Home Depot':
        return 'bg-orange-100 text-orange-800'
      case 'Wayfair':
        return 'bg-violet-100 text-violet-800'
      case 'Costco':
        return 'bg-blue-50 text-blue-700'
      case 'Amazon':
        return 'bg-yellow-50 text-yellow-700'
      case 'Walmart':
        return 'bg-cyan-50 text-cyan-700'
      // Pro Aggregators - Professional look
      case 'Wholesale2B':
        return 'bg-blue-900 text-white'
      case 'Spocket':
        return 'bg-purple-600 text-white'
      case 'SaleHoo':
        return 'bg-sky-500 text-white'
      case 'Inventory Source':
        return 'bg-green-700 text-white'
      case 'Dropified':
        return 'bg-gray-900 text-white'
      case 'Unverified':
        return 'bg-amber-100 text-amber-800 border border-amber-300'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  const handleSourceSelect = async (newSource) => {
    if (newSource === currentSource) {
      setIsOpen(false)
      return
    }

    setCurrentSource(newSource)
    setIsOpen(false)

    // Call parent handler if provided
    if (onSourceChange && itemId) {
      await onSourceChange(itemId, newSource)
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
        onClick={() => setIsOpen(!isOpen)}
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
        <div className="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            Change Source to...
          </div>
          {AVAILABLE_SOURCES.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => handleSourceSelect(src)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                src === currentSource ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(src)}`}>
                {src}
              </span>
              {src === currentSource && <span className="ml-2 text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SourceBadge

