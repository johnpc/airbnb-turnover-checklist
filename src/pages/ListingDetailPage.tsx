import { useParams, useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { useStays } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/utils/date'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listings } = useListings()
  const { data: stays, isLoading } = useStays(id!)

  const listing = listings?.find((l) => l.id === id)

  if (!listing) return <div className="p-4">Listing not found</div>
  if (isLoading) return <div className="p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{listing.name}</h1>
        {listing.address && <p className="text-muted-foreground">{listing.address}</p>}
      </div>

      <Card
        className="mb-4 bg-primary text-primary-foreground cursor-pointer hover:opacity-90"
        onClick={() => navigate(`/listings/${id}/stays/new`)}
      >
        <CardContent className="flex items-center justify-center p-6">
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-semibold">New Stay</span>
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
            <Card
              key={stay.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/stays/${stay.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{stay.guestName || 'Guest'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatDate(stay.checkInDate)} - {formatDate(stay.checkOutDate)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
