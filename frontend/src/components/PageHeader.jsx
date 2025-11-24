function PageHeader() {
  return (
    <div className="bg-black dark:bg-black border-b border-zinc-800 dark:border-zinc-800 py-6 sticky top-0 z-10">
      <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Left: Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-white mb-1">Dashboard</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-400">Welcome back, CEO. Here is your store health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

