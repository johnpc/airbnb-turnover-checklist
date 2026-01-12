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

  const rooms = (listing.rooms || []).filter((r): r is string => r !== null)
  const checkoutComplete =
    rooms.length > 0 && rooms.every((room) => checkoutPhotos?.some((p) => p.roomName === room))
  const checkinComplete =
    rooms.length > 0 && rooms.every((room) => checkinPhotos?.some((p) => p.roomName === room))

  return (
    <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
      <Button
        variant="outline"
        onClick={() => navigate(`/listings/${listing.id}`)}
        className="mb-3 sm:mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Guest: {stay.guestName || 'Unknown'}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {formatDate(stay.checkInDate)} - {formatDate(stay.checkOutDate)}
        </p>
        <p className="text-sm text-muted-foreground">{listing.name}</p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Card className={checkoutComplete ? 'border-green-500 border-2' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Checkout Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutComplete ? (
              <div>
                <p className="text-sm text-green-600 font-medium mb-2">✓ All photos complete</p>
                <Button
                  variant="default"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto"
                  onClick={() => navigate(`/stays/${id}/checkout-photos`)}
                >
                  View {checkoutPhotos?.length || 0} Photos
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {checkoutPhotos && checkoutPhotos.length > 0
                    ? `${checkoutPhotos.length} of ${rooms.length} rooms`
                    : 'No photos yet'}
                </p>
                <Button
                  onClick={() => navigate(`/stays/${id}/checkout-photos`)}
                  className="w-full sm:w-auto"
                >
                  Take Checkout Photos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={checkinComplete ? 'border-green-500 border-2' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Check-in Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {checkinComplete ? (
              <div>
                <p className="text-sm text-green-600 font-medium mb-2">✓ All photos complete</p>
                <Button
                  variant="default"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto"
                  onClick={() => navigate(`/stays/${id}/checkin-photos`)}
                >
                  View {checkinPhotos?.length || 0} Photos
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {checkinPhotos && checkinPhotos.length > 0
                    ? `${checkinPhotos.length} of ${rooms.length} rooms`
                    : 'No photos yet'}
                </p>
                <Button
                  onClick={() => navigate(`/stays/${id}/checkin-photos`)}
                  className="w-full sm:w-auto"
                >
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
