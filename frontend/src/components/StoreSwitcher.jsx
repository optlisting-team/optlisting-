import { useState, useRef, useEffect } from 'react'

export const MY_STORES = [
  { id: 'all', name: '🌍 All Stores', platform: 'Global', color: 'bg-gray-100 text-gray-800' },
  { id: 'store_ebay_1', name: 'eBay Main Store', platform: 'eBay', color: 'bg-slate-100 text-slate-700' },
  { id: 'store_amazon_1', name: 'Amazon US', platform: 'Amazon', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'store_coupang_1', name: 'Coupang KR', platform: 'Coupang', color: 'bg-red-100 text-red-700' }
]

// Get connected stores count (excluding 'all')
export const getConnectedStoreCount = () => {
  return MY_STORES.filter(store => store.id !== 'all').length
}

function StoreSwitcher({ currentStore, onStoreChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleStoreSelect = (store) => {
    if (store.id !== currentStore?.id) {
      onStoreChange(store)
    }
    setIsOpen(false)
  }

  const currentStoreData = currentStore || MY_STORES[0] // Default to "All Stores"

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Store Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-md ${currentStoreData.color}`}
      >
        <span className="font-bold">{currentStoreData.platform}</span>
        <span className="opacity-80">{currentStoreData.name}</span>
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50">
            Switch Store
          </div>
          <div className="max-h-64 overflow-y-auto">
            {MY_STORES.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  currentStoreData.id === store.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${store.color}`}>
                    {store.platform}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{store.name}</span>
                </div>
                {currentStoreData.id === store.id && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreSwitcher

