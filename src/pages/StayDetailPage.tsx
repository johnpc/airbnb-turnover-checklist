import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStay } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCheckoutPhotos, useCheckinPhotos } from '@/hooks/use-photos'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/utils/date'

export function StayDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stay } = useStay(id!)
  const { data: listings } = useListings()
  const { data: checkoutPhotos } = useCheckoutPhotos(id!)
  const { data: checkinPhotos } = useCheckinPhotos(id!)

  const listing = listings?.find((l) => l.id === stay?.listingId)

  if (!stay || !listing) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
        <h1 className="text-3xl font-bold">Guest: {stay.guestName || 'Unknown'}</h1>
        <p className="text-muted-foreground">
          {formatDate(stay.checkInDate)} - {formatDate(stay.checkOutDate)}
        </p>
        <p className="text-sm text-muted-foreground">{listing.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={hasCheckoutPhotos ? 'border-green-500 border-2' : ''}>
          <CardHeader>
            <CardTitle>Checkout Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCheckoutPhotos ? (
              <div>
                <p className="text-sm text-green-600 font-medium mb-2">✓ All photos complete</p>
                <Button
                  variant="default"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => navigate(`/stays/${id}/checkout-photos`)}
                >
                  View {checkoutPhotos.length} Photos
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">No photos yet</p>
                <Button onClick={() => navigate(`/stays/${id}/checkout-photos`)}>
                  Take Checkout Photos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={hasCheckinPhotos ? 'border-green-500 border-2' : ''}>
          <CardHeader>
            <CardTitle>Check-in Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCheckinPhotos ? (
              <div>
                <p className="text-sm text-green-600 font-medium mb-2">✓ All photos complete</p>
                <Button
                  variant="default"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => navigate(`/stays/${id}/checkin-photos`)}
                >
                  View {checkinPhotos.length} Photos
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">No photos yet</p>
                <Button onClick={() => navigate(`/stays/${id}/checkin-photos`)}>
                  Take Check-in Photos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
