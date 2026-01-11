import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStay } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCreateCheckinPhoto, useCheckinPhotos } from '@/hooks/use-photos'
import { uploadPhoto } from '@/utils/storage'
import { client } from '@/lib/data-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { CapturePhotoCard, type CapturePhotoCardRef } from '@/components/CapturePhotoCard'
import { LastPhotoCard } from '@/components/LastPhotoCard'
import { StayPhotosCard } from '@/components/StayPhotosCard'

export function CheckinPhotosPage() {
  const { stayId } = useParams<{ stayId: string }>()
  const navigate = useNavigate()
  const { data: stay } = useStay(stayId!)
  const { data: listings } = useListings()
  const { data: currentStayPhotos } = useCheckinPhotos(stayId!)
  const createPhoto = useCreateCheckinPhoto()
  const captureCardRef = useRef<CapturePhotoCardRef>(null)

  const listing = listings?.find((l) => l.id === stay?.listingId)
  const rooms = listing?.rooms || []

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const currentRoom = selectedRoom || rooms[currentRoomIndex]
  const allPhotosTaken = rooms.every((room) => currentStayPhotos?.some((p) => p.roomName === room))

  const handleRetake = (roomName: string) => {
    setSelectedRoom(roomName)
  }

  // Skip to first room without a photo
  useEffect(() => {
    if (!rooms.length || !currentStayPhotos) return

    const firstMissingRoomIndex = rooms.findIndex(
      (room) => !currentStayPhotos.some((p) => p.roomName === room)
    )

    if (firstMissingRoomIndex !== -1 && firstMissingRoomIndex !== currentRoomIndex) {
      setCurrentRoomIndex(firstMissingRoomIndex)
    }
  }, [rooms, currentStayPhotos, currentRoomIndex])

  const capturePhoto = async () => {
    const videoRef = captureCardRef.current?.videoRef
    const canvasRef = captureCardRef.current?.canvasRef
    if (!videoRef || !canvasRef || !stayId || !currentRoom) return

    setIsUploading(true)
    try {
      const canvas = canvasRef
      canvas.width = videoRef.videoWidth
      canvas.height = videoRef.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(videoRef, 0, 0)

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
      })

      const file = new File([blob], `${currentRoom}-${Date.now()}.jpg`, { type: 'image/jpeg' })
      const s3Key = await uploadPhoto(file, 'checkin', currentRoom)

      // Check if photo already exists for this room and delete it
      const existingPhoto = currentStayPhotos?.find((p) => p.roomName === currentRoom)
      if (existingPhoto) {
        await client.models.CheckinPhoto.delete({ id: existingPhoto.id })
      }

      await createPhoto.mutateAsync({
        stayId,
        s3Key,
        roomName: currentRoom,
        capturedAt: new Date().toISOString(),
      })

      // Find next room without a photo
      const nextRoomIndex = rooms.findIndex(
        (room, idx) =>
          idx > currentRoomIndex &&
          !currentStayPhotos?.some((p) => p.roomName === room && p.roomName !== currentRoom)
      )

      if (selectedRoom) {
        // If retaking, clear selection and stay on same view
        setSelectedRoom(null)
      } else if (nextRoomIndex !== -1) {
        setCurrentRoomIndex(nextRoomIndex)
      }
      // If all photos taken, don't navigate - show done state
    } finally {
      setIsUploading(false)
    }
  }

  if (!stay || !listing) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <CapturePhotoCard
        ref={captureCardRef}
        listingName={`Checkin Photos - ${listing.name}`}
        currentRoomIndex={currentRoomIndex}
        totalRooms={rooms.length}
        currentRoom={currentRoom || ''}
        isUploading={isUploading}
        isDone={allPhotosTaken && !selectedRoom}
        onCapture={capturePhoto}
        onCancel={() => navigate(`/stays/${stayId}`)}
      />

      <LastPhotoCard
        currentStayId={stayId!}
        listingId={stay.listingId || ''}
        roomName={currentRoom || ''}
        photoType="checkin"
      />

      <StayPhotosCard photos={currentStayPhotos} photoType="checkin" onRetake={handleRetake} />
    </div>
  )
}
