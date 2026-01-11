import { useNavigate } from 'react-router-dom'
import { Plus, Home, LogOut } from 'lucide-react'
import { useListings } from '@/hooks/use-listings'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ListingsPage() {
  const navigate = useNavigate()
  const { data: listings, isLoading } = useListings()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Listings</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => navigate('/listings/new')} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> New Listing
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="flex-1 sm:flex-none">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {!listings || listings.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">No listings yet</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Create your first listing to get started
          </p>
          <Button onClick={() => navigate('/listings/new')}>Create Listing</Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/listings/${listing.id}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">{listing.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {listing.address && (
                  <p className="text-sm text-muted-foreground">{listing.address}</p>
                )}
                {listing.rooms && listing.rooms.length > 0 && (
                  <p className="text-sm mt-2">{listing.rooms.length} rooms configured</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
