import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStays } from '@/hooks/use-stays'
import { useListings } from '@/hooks/use-listings'
import { useCreateCheckoutPhoto } from '@/hooks/use-photos'
import { uploadPhoto } from '@/utils/storage'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Camera } from 'lucide-react'

export function CheckoutPhotosPage() {
  const { stayId } = useParams<{ stayId: string }>()
  const navigate = useNavigate()
  const { data: stays } = useStays('')
  const { data: listings } = useListings()
  const createPhoto = useCreateCheckoutPhoto()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stay = stays?.find((s) => s.id === stayId)
  const listing = listings?.find((l) => l.id === stay?.listingId)
  const rooms = listing?.rooms || []

  const [currentRoomIndex, setCurrentRoomIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const currentRoom = rooms[currentRoomIndex]
  const isLastRoom = currentRoomIndex === rooms.length - 1

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !stayId || !currentRoom) return

    setIsUploading(true)
    try {
      const s3Key = await uploadPhoto(file, 'checkout', currentRoom)
      await createPhoto.mutateAsync({
        stayId,
        s3Key,
        roomName: currentRoom,
        capturedAt: new Date().toISOString(),
      })

      if (isLastRoom) {
        navigate(`/listings/${stay?.listingId}`)
      } else {
        setCurrentRoomIndex(currentRoomIndex + 1)
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (!stay || !listing) return <div className="p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Checkout Photos - {listing.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Room {currentRoomIndex + 1} of {rooms.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">{currentRoom}</h2>
            <p className="text-muted-foreground mb-6">
              Take a photo of how the guest left this room
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full max-w-xs"
            >
              <Camera className="mr-2 h-5 w-5" />
              {isUploading ? 'Uploading...' : 'Take Photo'}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(`/listings/${stay.listingId}`)}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
