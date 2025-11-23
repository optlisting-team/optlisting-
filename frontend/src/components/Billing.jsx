import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { getConnectedStoreCount } from './StoreSwitcher'

function Billing() {
  const [currentPlan] = useState("PRO") // Default: PRO for demo
  const connectedStoreCount = getConnectedStoreCount()

  // Get max store limit based on plan
  const getMaxStoreLimit = (plan) => {
    switch (plan) {
      case "Starter":
        return 1
      case "PRO":
        return 10
      case "MASTER":
        return 25
      case "Enterprise":
        return Infinity
      default:
        return 10
    }
  }

  const maxStoreLimit = getMaxStoreLimit(currentPlan)

  const getPlanStyles = (plan) => {
    switch (plan) {
      case "PRO":
        return "bg-slate-900 text-white border-slate-800"
      case "MASTER":
        return "bg-slate-900 text-white border-slate-800"
      case "Enterprise":
        return "bg-slate-900 text-white border-slate-800"
      case "Starter":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const formatStoreUtilization = () => {
    if (maxStoreLimit === Infinity) {
      return `💎 ${currentPlan}: ${connectedStoreCount} / ∞ Stores`
    }
    return `💎 ${currentPlan}: ${connectedStoreCount} / ${maxStoreLimit} Stores`
  }

  const handleOpenPortal = () => {
    // TODO: Replace with actual Lemon Squeezy customer portal URL
    // const portalUrl = `https://app.lemonsqueezy.com/customer-portal/${customerId}`
    alert('Customer Portal will open here. This will link to Lemon Squeezy customer portal.')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Spacing for fixed navbar */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Subscription Management</h1>
            <p className="text-lg text-gray-600">
              Manage your plan, update payment method, or download invoices.
            </p>
          </div>

          {/* Current Plan Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-0 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`px-6 py-3 rounded-full text-sm font-bold ${getPlanStyles(currentPlan)}`}>
                  {formatStoreUtilization()}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plan Details</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {currentPlan} Plan
                    {maxStoreLimit !== Infinity && ` • ${maxStoreLimit} Stores Max`}
                    {maxStoreLimit === Infinity && ` • Unlimited Stores`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Portal Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Customer Portal</h2>
            <p className="text-gray-600 mb-6">
              Access your customer portal to manage subscriptions, update payment methods, view invoices, and more.
            </p>
            <button
              onClick={handleOpenPortal}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Open Customer Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing

