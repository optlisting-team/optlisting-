import { useState, useEffect } from 'react'
import axios from 'axios'
import SummaryCard from './SummaryCard'
import ZombieTable from './ZombieTable'
import ExportButton from './ExportButton'

const API_BASE_URL = 'http://localhost:8000'

function Dashboard() {
  const [zombies, setZombies] = useState([])
  const [totalZombies, setTotalZombies] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchZombies = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/analyze`, {
        params: {
          days_old: 60,
          min_sold_qty: 0
        }
      })
      setZombies(response.data.zombies)
      setTotalZombies(response.data.total_zombies)
      setError(null)
    } catch (err) {
      setError('Failed to fetch zombie listings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchZombies()
  }, [])

  const handleExport = async (mode) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/export`,
        null,
        {
          params: {
            export_mode: mode,
            days_old: 60,
            min_sold_qty: 0
          },
          responseType: 'blob'
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const filenameMap = {
        autods: 'zombies_autods.csv',
        yaballe: 'zombies_yaballe.csv',
        ebay: 'zombies_ebay.csv'
      }
      
      link.setAttribute('download', filenameMap[mode])
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('Failed to export CSV')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          OptListing
        </h1>
        <p className="text-gray-600">
          Zombie Listing Detector & Bulk Delete Tool
        </p>
      </div>

      {/* Summary Card */}
      <div className="mb-6">
        <SummaryCard totalZombies={totalZombies} loading={loading} />
      </div>

      {/* Export Button */}
      {totalZombies > 0 && (
        <div className="mb-6 flex justify-end">
          <ExportButton onExport={handleExport} />
        </div>
      )}

      {/* Zombie Table */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading zombie listings...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : zombies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No zombie listings found! 🎉
          </div>
        ) : (
          <ZombieTable zombies={zombies} />
        )}
      </div>
    </div>
  )
}

export default Dashboard

