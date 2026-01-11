import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useListings } from '@/hooks/use-listings'
import { client } from '@/lib/data-client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listings } = useListings()
  const listing = listings?.find((l) => l.id === id)

  const [name, setName] = useState(listing?.name || '')
  const [address, setAddress] = useState(listing?.address || '')
  const [icalUrl, setIcalUrl] = useState(listing?.icalUrl || '')
  const [rooms, setRooms] = useState(
    (listing?.rooms || []).filter((r): r is string => r !== null).join(', ')
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!id || !name) return
    setIsSaving(true)
    try {
      await client.models.Listing.update({
        id,
        name,
        address: address || null,
        icalUrl: icalUrl || null,
        rooms: rooms
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      })
      navigate(`/listings/${id}`)
    } catch (error) {
      console.error('Error updating listing:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!listing) return <div className="p-4">Listing not found</div>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button variant="outline" onClick={() => navigate(`/listings/${id}`)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">iCal URL</label>
            <input
              type="url"
              value={icalUrl}
              onChange={(e) => setIcalUrl(e.target.value)}
              placeholder="https://www.airbnb.com/calendar/ical/..."
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              <strong>How to get this:</strong> Open Airbnb app → Hosting → Calendar tab → Settings
              → Availability tab → Scroll to bottom "Connect calendars" → "Connect to another
              website" → Copy the URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rooms (comma-separated)</label>
            <input
              type="text"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="Kitchen, Bathroom, Living Room"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving || !name} className="w-full">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
