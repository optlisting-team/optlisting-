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
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">{selectedStore?.name || 'Select Store'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
            <div className="py-1" role="menu">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleSelectStore(store)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 transition-colors ${
                    selectedStore?.id === store.id
                      ? 'bg-white text-zinc-900 font-medium'
                      : 'text-zinc-300'
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
