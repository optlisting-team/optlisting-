import { useState, useRef, useEffect } from 'react'
import { useStore } from '../contexts/StoreContext'
import { ChevronDown } from 'lucide-react'

export const MY_STORES = [
  { id: 'all', name: 'All Stores', platform: 'All' },
  { id: 'store-1', name: 'eBay Store', platform: 'eBay' },
  { id: 'store-2', name: 'Amazon Store', platform: 'Amazon' },
  { id: 'store-3', name: 'Shopify Store', platform: 'Shopify' },
  { id: 'store-4', name: 'Walmart Store', platform: 'Walmart' }
]

function StoreSwitcher() {
  const { stores, selectedStore, setSelectedStore } = useStore()
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

  const handleSelectStore = (store) => {
    setSelectedStore(store)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-slate-900 font-semibold">{selectedStore?.name || 'Select Store'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
            <div className="py-1" role="menu">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleSelectStore(store)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                    selectedStore?.id === store.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700'
                  }`}
                  role="menuitem"
                >
                  {store.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StoreSwitcher
