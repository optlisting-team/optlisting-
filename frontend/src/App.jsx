import { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

export default App

