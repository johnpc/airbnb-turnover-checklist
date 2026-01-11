import { useEffect, useState } from 'react'
import { useStays } from '@/hooks/use-stays'
import { client } from '@/lib/data-client'
import { getPhotoUrl } from '@/utils/storage'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type LastPhotoCardProps = {
  currentStayId: string
  listingId: string
  roomName: string
  photoType: 'checkout' | 'checkin'
}

export function LastPhotoCard({
  currentStayId,
  listingId,
  roomName,
  photoType,
}: LastPhotoCardProps) {
  const { data: allStays } = useStays(listingId)
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('LastPhotoCard props:', { currentStayId, listingId, roomName, photoType })

  useEffect(() => {
    const loadLastPhoto = async () => {
      console.log('loadLastPhoto called', { allStays: allStays?.length, roomName })

      if (!allStays || !roomName || !listingId) {
        console.log('Missing data:', { hasStays: !!allStays, roomName, listingId })
        setIsLoading(false)
        return
      }

      console.log('Looking for last photo:', { roomName, photoType, allStays: allStays.length })

      // Get previous stays (excluding current one) sorted by checkout date
      const previousStays = allStays
        .filter((s) => s.id !== currentStayId)
        .sort((a, b) => new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime())

      console.log(
        'Previous stays:',
        previousStays.map((s) => ({ id: s.id, checkOutDate: s.checkOutDate }))
      )

      // Search through previous stays for a photo of this room (try both types)
      for (const stay of previousStays) {
        console.log(`Checking stay ${stay.id}`)

        // Try the matching photo type first
        const { data: matchingPhotos } =
          photoType === 'checkout'
            ? await client.models.CheckoutPhoto.list({ filter: { stayId: { eq: stay.id } } })
            : await client.models.CheckinPhoto.list({ filter: { stayId: { eq: stay.id } } })

        console.log(
          `Stay ${stay.id} (${photoType}): found ${matchingPhotos?.length || 0} photos`,
          matchingPhotos?.map((p) => p.roomName)
        )

        // Double-check we're not using current stay photos
        let roomPhoto = matchingPhotos
          ?.filter((p) => p.stayId !== currentStayId)
          .find((p) => p.roomName === roomName)

        // If not found, try the opposite type (but still from previous stays only)
        if (!roomPhoto) {
          const { data: otherPhotos } =
            photoType === 'checkout'
              ? await client.models.CheckinPhoto.list({ filter: { stayId: { eq: stay.id } } })
              : await client.models.CheckoutPhoto.list({ filter: { stayId: { eq: stay.id } } })

          console.log(
            `Stay ${stay.id} (other type): found ${otherPhotos?.length || 0} photos`,
            otherPhotos?.map((p) => p.roomName)
          )
          roomPhoto = otherPhotos
            ?.filter((p) => p.stayId !== currentStayId)
            .find((p) => p.roomName === roomName)
        }

        if (roomPhoto) {
          console.log('Found matching room photo from previous stay:', roomPhoto)
          console.log('S3 Key:', roomPhoto.s3Key)
          try {
            const url = await getPhotoUrl(roomPhoto.s3Key)
            console.log('Generated URL:', url)
            setLastPhotoUrl(url)
            setIsLoading(false)
            return
          } catch (error) {
            console.error('Error getting photo URL:', error)
            setLastPhotoUrl(null)
            setIsLoading(false)
            return
          }
        }
      }

      console.log('No photo found for room in previous stays:', roomName)
      setLastPhotoUrl(null)
      setIsLoading(false)
    }

    loadLastPhoto()
  }, [allStays, currentStayId, roomName, photoType, listingId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Last Photo of {roomName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : lastPhotoUrl ? (
          <img src={lastPhotoUrl} alt={`Last photo of ${roomName}`} className="w-full rounded-lg" />
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            This is your first time taking a photo of {roomName}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
