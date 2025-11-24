import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './contexts/StoreContext'
import LandingPage from './components/LandingPage'

// Lazy load DashboardPage to prevent FOUC
const DashboardPage = lazy(() => import('./components/DashboardPage'))

// Simple loading fallback for route transitions
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <DashboardPage />
              </Suspense>
            } 
          />
        </Routes>
      </Router>
    </StoreProvider>
  )
}

export default App

