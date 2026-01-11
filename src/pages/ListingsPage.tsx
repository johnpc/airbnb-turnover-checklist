import { useNavigate } from 'react-router-dom'
import { Plus, Home, LogOut } from 'lucide-react'
import { useListings } from '@/hooks/use-listings'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function ListingsPage() {
  const navigate = useNavigate()
  const { data: listings, isLoading } = useListings()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) return <div className="p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/listings/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Listing
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {!listings || listings.length === 0 ? (
        <Card className="p-12 text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
          <p className="text-muted-foreground mb-4">Create your first listing to get started</p>
          <Button onClick={() => navigate('/listings/new')}>Create Listing</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/listings/${listing.id}`)}
            >
              <CardHeader>
                <CardTitle>{listing.name}</CardTitle>
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
