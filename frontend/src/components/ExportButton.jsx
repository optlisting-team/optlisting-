import { useState } from 'react'
import { Button } from './ui/button'

function ExportButton({ onExport }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = (mode) => {
    onExport(mode)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Export CSV
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleExport('autods')}
              >
                For AutoDS
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleExport('yaballe')}
              >
                For Yaballe
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleExport('ebay')}
              >
                For eBay File Exchange
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportButton

