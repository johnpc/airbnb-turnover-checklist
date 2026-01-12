import { Home, LogOut, Trash2, X, Key } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { deleteAccount } from '@/utils/auth'
import { showSuccess, showError, showConfirm } from '@/utils/alerts'

type SettingsSidebarProps = {
  isOpen: boolean
  onClose: () => void
  onChangePassword: () => void
}

export function SettingsSidebar({ isOpen, onClose, onChangePassword }: SettingsSidebarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleChangePassword = () => {
    onClose()
    onChangePassword()
  }

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm(
      'This action cannot be undone. All your data will be permanently deleted.'
    )
    if (confirmed) {
      try {
        await deleteAccount()
        await showSuccess('Account deleted successfully')
        onClose()
      } catch (error) {
        await showError(error instanceof Error ? error.message : 'Failed to delete account')
      }
    }
  }

  const handleHome = () => {
    navigate('/')
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
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
