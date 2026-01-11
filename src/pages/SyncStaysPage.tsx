import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useListings } from '@/hooks/use-listings'
import { useStays } from '@/hooks/use-stays'
import { client } from '@/lib/data-client'
import { parseICalFeed } from '@/utils/ical'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SyncStaysPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listings, isLoading: listingsLoading } = useListings()
  const { data: existingStays } = useStays(id!)
  const listing = listings?.find((l) => l.id === id)

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{
    created: number
    skipped: number
    errors: string[]
  } | null>(null)

  const handleSync = async () => {
    if (!listing?.icalUrl || !id) return

    setIsSyncing(true)
    setSyncResult(null)

    try {
      const events = await parseICalFeed(listing.icalUrl)
      console.log('Parsed events:', events)
      let created = 0
      let skipped = 0
      const errors: string[] = []

      for (const event of events) {
        console.log('Processing event:', event)

        // Skip if we already have this confirmation code
        if (
          event.confirmationCode &&
          existingStays?.some((s) => s.confirmationCode === event.confirmationCode)
        ) {
          console.log('Skipping duplicate:', event.confirmationCode)
          skipped++
          continue
        }

        // Create the stay
        console.log('Creating stay:', {
          listingId: id,
          checkInDate: event.checkInDate,
          checkOutDate: event.checkOutDate,
          confirmationCode: event.confirmationCode || null,
          guestName: event.phoneLastFour ? `Guest (${event.phoneLastFour})` : null,
        })

        try {
          const result = await client.models.Stay.create({
            listingId: id,
            checkInDate: event.checkInDate,
            checkOutDate: event.checkOutDate,
            confirmationCode: event.confirmationCode || null,
            guestName: event.phoneLastFour ? `Guest (${event.phoneLastFour})` : null,
          })

          console.log('Create result:', result)

          if (result.errors && result.errors.length > 0) {
            errors.push(
              `${event.confirmationCode || event.checkInDate}: ${result.errors[0].message}`
            )
          } else {
            created++
          }
        } catch (err) {
          errors.push(
            `${event.confirmationCode || event.checkInDate}: ${err instanceof Error ? err.message : 'Unknown error'}`
          )
        }
      }

      setSyncResult({ created, skipped, errors })
    } catch (error) {
      console.error('Error syncing stays:', error)
      setSyncResult({
        created: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      })
    } finally {
      setIsSyncing(false)
    }
  }

  if (listingsLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Skeleton className="h-10 w-32 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!listing) return <div className="p-4">Listing not found</div>

  if (!listing.icalUrl) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Button variant="outline" onClick={() => navigate(`/listings/${id}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>No iCal URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to add an iCal URL to this listing before you can sync stays.
            </p>
            <Button onClick={() => navigate(`/listings/${id}/edit`)}>Edit Listing</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 max-w-2xl">
      <Button
        variant="outline"
        onClick={() => navigate(`/listings/${id}`)}
        className="mb-3 sm:mb-4 w-full sm:w-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Sync Stays from iCal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <p className="text-sm text-muted-foreground">
            This will import reservations from your Airbnb calendar. Existing stays with matching
            confirmation codes will be skipped.
          </p>

          <Button onClick={handleSync} disabled={isSyncing} className="w-full">
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>

          {syncResult && (
            <div
              className={`p-3 sm:p-4 border rounded-md ${syncResult.errors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}
            >
              <p
                className={`text-sm font-medium ${syncResult.errors.length > 0 ? 'text-yellow-800' : 'text-green-800'}`}
              >
                {syncResult.errors.length > 0 ? 'Sync Completed with Errors' : 'Sync Complete!'}
              </p>
              <p
                className={`text-sm ${syncResult.errors.length > 0 ? 'text-yellow-700' : 'text-green-700'}`}
              >
                Created: {syncResult.created} | Skipped: {syncResult.skipped}
              </p>
              {syncResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-yellow-800">Errors:</p>
                  <ul className="text-xs text-yellow-700 list-disc list-inside">
                    {syncResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(`/listings/${id}`)}
                className="mt-2 w-full sm:w-auto"
              >
                View Stays
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
