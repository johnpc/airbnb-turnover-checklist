import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStays } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCheckoutPhotos, useCheckinPhotos } from '@/hooks/use-photos'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/utils/date'

export function StayDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stays } = useStays('')
  const { data: listings } = useListings()
  const { data: checkoutPhotos } = useCheckoutPhotos(id!)
  const { data: checkinPhotos } = useCheckinPhotos(id!)

  const stay = stays?.find((s) => s.id === id)
  const listing = listings?.find((l) => l.id === stay?.listingId)

  if (!stay || !listing) return <div className="p-4">Loading...</div>

  const hasCheckoutPhotos = checkoutPhotos && checkoutPhotos.length > 0
  const hasCheckinPhotos = checkinPhotos && checkinPhotos.length > 0

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="outline"
        onClick={() => navigate(`/listings/${listing.id}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{stay.guestName || 'Guest'}</h1>
        <p className="text-muted-foreground">
          {formatDate(stay.checkInDate)} - {formatDate(stay.checkOutDate)}
        </p>
        <p className="text-sm text-muted-foreground">{listing.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Checkout Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCheckoutPhotos ? (
              <p className="text-sm">{checkoutPhotos.length} photos</p>
            ) : (
              <p className="text-sm text-muted-foreground">No photos yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check-in Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCheckinPhotos ? (
              <p className="text-sm">{checkinPhotos.length} photos</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">No photos yet</p>
                <Button onClick={() => navigate(`/stays/${id}/checkin-photos`)}>Take Photos</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
