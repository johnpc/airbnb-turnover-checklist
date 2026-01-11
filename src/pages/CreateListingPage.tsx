import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateListing } from '@/hooks/use-listings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

export function CreateListingPage() {
  const navigate = useNavigate()
  const createListing = useCreateListing()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [icalUrl, setIcalUrl] = useState('')
  const [rooms, setRooms] = useState<string[]>([])
  const [currentRoom, setCurrentRoom] = useState('')

  const handleAddRoom = () => {
    if (currentRoom.trim()) {
      setRooms([...rooms, currentRoom.trim()])
      setCurrentRoom('')
    }
  }

  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createListing.mutateAsync({ name, address, icalUrl, rooms })
    navigate('/')
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Beach House"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Ocean Dr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Airbnb iCal URL</label>
              <Input
                type="url"
                value={icalUrl}
                onChange={(e) => setIcalUrl(e.target.value)}
                placeholder="https://www.airbnb.com/calendar/ical/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                <strong>How to get this:</strong> Open Airbnb app → Hosting → Calendar tab →
                Settings → Availability tab → Scroll to bottom "Connect calendars" → "Connect to
                another website" → Copy the URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rooms/Areas</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentRoom}
                  onChange={(e) => setCurrentRoom(e.target.value)}
                  placeholder="Living Room"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRoom())}
                />
                <Button type="button" onClick={handleAddRoom}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {rooms.map((room, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md"
                  >
                    <span className="text-sm">{room}</span>
                    <button type="button" onClick={() => handleRemoveRoom(i)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createListing.isPending}>
                {createListing.isPending ? 'Creating...' : 'Create Listing'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
