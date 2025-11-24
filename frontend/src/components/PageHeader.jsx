function PageHeader({ lastSynced = 'just now' }) {
  const handleSync = () => {
    // Sync functionality can be added later
    console.log('Syncing data...')
    // You can add a sync function here
  }

  return (
    <div className="bg-black dark:bg-black border-b border-zinc-800 dark:border-zinc-800 py-6 sticky top-0 z-10">
      <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Left: Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-white mb-1">Dashboard</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-400">Welcome back, CEO. Here is your store health.</p>
          </div>

          {/* Right: Sync Info & Button */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 dark:text-zinc-400">Last synced: {lastSynced}</span>
            <button
              onClick={handleSync}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white text-black dark:text-black rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Sync Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

