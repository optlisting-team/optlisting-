import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import PageHeader from './components/PageHeader'
import Dashboard from './components/Dashboard'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Spacing for fixed navbar */}
      <div className="pt-16">
        {/* Page Header */}
        <PageHeader />
        
        {/* Main Content */}
        <div className="py-8">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

export default App

