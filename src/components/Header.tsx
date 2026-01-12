import { Camera, Settings, Home, LogOut, Trash2, X, Key } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false)
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setShowSidebar(false)
  }

  const handleChangePassword = () => {
    // TODO: Implement change password
    alert('Change password functionality will be implemented soon')
    setShowSidebar(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion will be implemented soon')
      setShowSidebar(false)
    }
  }

  const handleHome = () => {
    navigate('/')
    setShowSidebar(false)
  }

  if (!user) return null

  return (
    <>
      <header className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
              <h1 className="text-lg sm:text-xl font-bold">Turnover Tracker</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowSidebar(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-2 sm:px-3"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 py-4">
            <button
              onClick={handleHome}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={handleChangePassword}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
            >
              <Key className="h-5 w-5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
