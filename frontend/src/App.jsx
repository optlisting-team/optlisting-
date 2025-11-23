import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './contexts/StoreContext'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'
import Billing from './components/Billing'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } />
          <Route path="/billing" element={
            <DashboardLayout>
              <Billing />
            </DashboardLayout>
          } />
          <Route path="/listings" element={
            <DashboardLayout>
              <div className="p-8">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Listings</h1>
                <p className="text-slate-500">Listings page coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/history" element={
            <DashboardLayout>
              <div className="p-8">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4">History</h1>
                <p className="text-slate-500">History page coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <div className="p-8">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Settings</h1>
                <p className="text-slate-500">Settings page coming soon...</p>
              </div>
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </StoreProvider>
  )
}

export default App

