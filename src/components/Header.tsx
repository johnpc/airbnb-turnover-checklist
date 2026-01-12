import { Camera } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2">
          <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
          <h1 className="text-lg sm:text-xl font-bold">Turnover Tracker</h1>
        </div>
      </div>
    </header>
  )
}
