import { useParams, useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { useStays } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCheckoutPhotos, useCheckinPhotos } from '@/hooks/use-photos'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/utils/date'

function StayCard({
  stay,
  listing,
}: {
  stay: { id: string; guestName: string | null; checkInDate: string; checkOutDate: string }
  listing: { rooms: (string | null)[] | null }
}) {
  const navigate = useNavigate()
  const { data: checkoutPhotos } = useCheckoutPhotos(stay.id)
  const { data: checkinPhotos } = useCheckinPhotos(stay.id)

  const rooms = (listing.rooms || []).filter((r): r is string => r !== null)
  const checkoutComplete =
    rooms.length > 0 && rooms.every((room) => checkoutPhotos?.some((p) => p.roomName === room))
  const checkinComplete =
    rooms.length > 0 && rooms.every((room) => checkinPhotos?.some((p) => p.roomName === room))
  const allComplete = checkoutComplete && checkinComplete

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${allComplete ? 'border-green-500 border-2' : ''}`}
      onClick={() => navigate(`/stays/${stay.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{stay.guestName || 'Guest'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {formatDate(stay.checkInDate)} - {formatDate(stay.checkOutDate)}
        </p>
        {allComplete && (
          <p className="text-sm text-green-600 font-medium mt-2">
            ✓ All check-in/checkout photos complete
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listings } = useListings()
  const { data: stays, isLoading } = useStays(id!)

  const listing = listings?.find((l) => l.id === id)

  if (!listing) return <div className="p-4">Listing not found</div>

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => navigate(`/listings/${id}/edit`)}>
          Edit Listing
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{listing.name}</h1>
        {listing.address && <p className="text-muted-foreground">{listing.address}</p>}
      </div>

      <Card
        className="mb-4 bg-secondary text-secondary-foreground cursor-pointer hover:opacity-90"
        onClick={() => navigate(`/listings/${id}/stays/sync`)}
      >
        <CardContent className="flex items-center justify-center p-6">
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-semibold">Sync from iCal</span>
        </CardContent>
      </Card>

      <Card
        className="mb-4 bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
        onClick={() => navigate(`/listings/${id}/stays/new`)}
      >
        <CardContent className="flex items-center justify-center p-6">
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-semibold">New Stay (Manual)</span>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Past Stays</h2>
      {!stays || stays.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No stays yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {stays.map((stay) => (
            <StayCard key={stay.id} stay={stay} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
