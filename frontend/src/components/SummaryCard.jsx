function SummaryCard({ totalZombies, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Total Zombies Found
          </h2>
          {loading ? (
            <div className="text-3xl font-bold text-gray-400">Loading...</div>
          ) : (
            <div className="text-5xl font-bold text-red-600">
              {totalZombies}
            </div>
          )}
        </div>
        <div className="text-6xl">🧟</div>
      </div>
      <p className="text-gray-600 mt-4">
        Listings older than 60 days with 0 sales
      </p>
    </div>
  )
}

export default SummaryCard

