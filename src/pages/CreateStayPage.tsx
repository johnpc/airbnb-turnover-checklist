import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreateStay } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function CreateStayPage() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const createStay = useCreateStay()
  const { data: listings } = useListings()
  const [guestName, setGuestName] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  const listing = listings?.find((l) => l.id === listingId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const stay = await createStay.mutateAsync({
      listingId: listingId!,
      guestName,
      checkInDate,
      checkOutDate,
    })
    navigate(`/stays/${stay?.id}/checkout-photos`)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New Stay - {listing?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Guest Name</label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check-in Date *</label>
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check-out Date *</label>
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createStay.isPending}>
                {createStay.isPending ? 'Creating...' : 'Start Checkout Photos'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/listings/${listingId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
