import { useEffect, useState } from 'react'
import { useStays } from '@/hooks/use-stays'
import { client } from '@/lib/data-client'
import { getPhotoUrl } from '@/utils/storage'
import { formatDate } from '@/utils/date'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type LastPhotoCardProps = {
  currentStayId: string
  listingId: string
  roomName: string
  photoType: 'checkout' | 'checkin'
}

type PhotoInfo = {
  url: string
  guestName: string | null
  checkInDate: string
  checkOutDate: string
  createdAt: string
  photoType: 'checkout' | 'checkin'
}

export function LastPhotoCard({
  currentStayId,
  listingId,
  roomName,
  photoType,
}: LastPhotoCardProps) {
  const { data: allStays } = useStays(listingId)
  const [photoInfo, setPhotoInfo] = useState<PhotoInfo | null>(null)
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
        let foundPhotoType: 'checkout' | 'checkin' = photoType

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
          foundPhotoType = photoType === 'checkout' ? 'checkin' : 'checkout'
        }

        if (roomPhoto) {
          console.log('Found matching room photo from previous stay:', roomPhoto)
          console.log('S3 Key:', roomPhoto.s3Key)
          try {
            const url = await getPhotoUrl(roomPhoto.s3Key)
            console.log('Generated URL:', url)
            setPhotoInfo({
              url,
              guestName: stay.guestName,
              checkInDate: stay.checkInDate,
              checkOutDate: stay.checkOutDate,
              createdAt: roomPhoto.createdAt,
              photoType: foundPhotoType,
            })
            setIsLoading(false)
            return
          } catch (error) {
            console.error('Error getting photo URL:', error)
            setPhotoInfo(null)
            setIsLoading(false)
            return
          }
        }
      }

      console.log('No photo found for room in previous stays:', roomName)
      setPhotoInfo(null)
      setIsLoading(false)
    }

    loadLastPhoto()
  }, [allStays, currentStayId, roomName, photoType, listingId])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Last Photo of {roomName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : photoInfo ? (
          <div className="space-y-3">
            <img
              src={photoInfo.url}
              alt={`Last photo of ${roomName}`}
              className="w-full rounded-lg"
            />
            <div className="text-sm space-y-1">
              <p className="font-medium">Guest: {photoInfo.guestName || 'Unknown'}</p>
              <p className="text-muted-foreground">
                Stay: {formatDate(photoInfo.checkInDate)} - {formatDate(photoInfo.checkOutDate)}
              </p>
              <p className="text-muted-foreground">
                Photo taken: {new Date(photoInfo.createdAt).toLocaleDateString()} (
                {photoInfo.photoType})
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            This is your first time taking a photo of {roomName}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
