import { Camera, Settings, Home, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'

export function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setShowMenu(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion will be implemented soon')
      setShowMenu(false)
    }
  }

  const handleHome = () => {
    navigate('/')
    setShowMenu(false)
  }

  if (!user) return null

  return (
    <header className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
            <h1 className="text-lg sm:text-xl font-bold">Turnover Tracker</h1>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-2 sm:px-3"
            >
              <Settings className="h-5 w-5" />
            </Button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                  <button
                    onClick={handleHome}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
