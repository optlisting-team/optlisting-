import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'
import Billing from './components/Billing'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </Router>
  )
}

export default App

