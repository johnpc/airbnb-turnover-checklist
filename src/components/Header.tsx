import { Camera, Settings, Home, LogOut, Trash2, X, Key } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setShowSidebar(false)
  }

  const handleChangePassword = () => {
    setShowSidebar(false)
    setShowPasswordModal(true)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChanging(true)
    try {
      const { updatePassword } = await import('aws-amplify/auth')
      await updatePassword({ oldPassword, newPassword })
      alert('Password changed successfully!')
      setShowPasswordModal(false)
      setOldPassword('')
      setNewPassword('')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setIsChanging(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const { deleteUser } = await import('aws-amplify/auth')
        await deleteUser()
        alert('Account deleted successfully')
        setShowSidebar(false)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete account')
      }
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

      {/* Sidebar Overlay */}
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isChanging} className="flex-1">
                    {isChanging ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
