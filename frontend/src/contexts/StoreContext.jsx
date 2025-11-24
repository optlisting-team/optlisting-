import { createContext, useContext, useState } from 'react'
import { MY_STORES } from '../components/StoreSwitcher'

// Default store: First real store (eBay Store)
const DEFAULT_STORE = MY_STORES[0] // First item is now the first actual store

const StoreContext = createContext({
  stores: MY_STORES,
  selectedStore: DEFAULT_STORE,
  setSelectedStore: () => {}
})

export const StoreProvider = ({ children }) => {
  const [selectedStore, setSelectedStore] = useState(DEFAULT_STORE)

  return (
    <StoreContext.Provider
      value={{
        stores: MY_STORES,
        selectedStore,
        setSelectedStore
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}



