import { Camera, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { SettingsSidebar } from './SettingsSidebar'
import { ChangePasswordModal } from './ChangePasswordModal'

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { user } = useAuth()

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

      <SettingsSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onChangePassword={() => setShowPasswordModal(true)}
      />

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  )
}
