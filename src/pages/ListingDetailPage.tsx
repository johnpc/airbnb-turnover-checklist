import { useParams, useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft, Pencil } from 'lucide-react'
import { useStays, useUpdateStay } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCheckoutPhotos, useCheckinPhotos } from '@/hooks/use-photos'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/utils/date'
import { useState } from 'react'
import { NotFound } from '@/components/NotFound'

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
  const updateStay = useUpdateStay()
  const [isEditing, setIsEditing] = useState(false)
  const [guestName, setGuestName] = useState(stay.guestName || '')

  const rooms = (listing.rooms || []).filter((r): r is string => r !== null)
  const checkoutComplete =
    rooms.length > 0 && rooms.every((room) => checkoutPhotos?.some((p) => p.roomName === room))
  const checkinComplete =
    rooms.length > 0 && rooms.every((room) => checkinPhotos?.some((p) => p.roomName === room))
  const allComplete = checkoutComplete && checkinComplete

  const handleSave = () => {
    updateStay.mutate({ id: stay.id, guestName })
    setIsEditing(false)
  }

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${allComplete ? 'border-green-500 border-2' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              />
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <CardTitle
                className="text-lg cursor-pointer flex-1"
                onClick={() => navigate(`/stays/${stay.id}`)}
              >
                {stay.guestName || 'Guest'}
              </CardTitle>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="px-2 py-1"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent onClick={() => navigate(`/stays/${stay.id}`)} className="cursor-pointer">
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
  const { data: listings, isLoading: listingsLoading } = useListings()
  const { data: stays, isLoading: staysLoading } = useStays(id!)

  const listing = listings?.find((l) => l.id === id)

  if (listingsLoading || staysLoading) {
    return (
      <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-4" />
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

  if (!listing)
    return (
      <NotFound
        title="Listing Not Found"
        message="This listing doesn't exist or has been deleted."
      />
    )

  return (
    <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/listings/${id}/edit`)}
          className="w-full sm:w-auto"
        >
          Edit Listing
        </Button>
      </div>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{listing.name}</h1>
        {listing.address && (
          <p className="text-sm sm:text-base text-muted-foreground">{listing.address}</p>
        )}
      </div>

      <Card
        className="mb-3 sm:mb-4 bg-secondary text-secondary-foreground cursor-pointer hover:opacity-90"
        onClick={() => navigate(`/listings/${id}/stays/sync`)}
      >
        <CardContent className="flex items-center justify-center p-4 sm:p-6">
          <Plus className="mr-2 h-5 w-5" />
          <span className="text-sm sm:text-base font-semibold">Sync from iCal</span>
        </CardContent>
      </Card>

      <Card
        className="mb-3 sm:mb-4 bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
        onClick={() => navigate(`/listings/${id}/stays/new`)}
      >
        <CardContent className="flex items-center justify-center p-4 sm:p-6">
          <Plus className="mr-2 h-5 w-5" />
          <span className="text-sm sm:text-base font-semibold">New Stay (Manual)</span>
        </CardContent>
      </Card>

      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Past Stays</h2>
      {!stays || stays.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">No stays yet</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {stays
            .filter((stay) => new Date(stay.checkOutDate) < new Date())
            .map((stay) => (
              <StayCard key={stay.id} stay={stay} listing={listing} />
            ))}
        </div>
      )}
    </div>
  )
}
