import { useEffect, useState } from 'react'
import { getPhotoUrl } from '@/utils/storage'
import { client } from '@/lib/data-client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type Photo = {
  id: string
  roomName: string | null
  s3Key: string
  createdAt: string
}

type StayPhotosCardProps = {
  photos: Photo[] | undefined
  photoType: 'checkout' | 'checkin'
  onRetake?: (roomName: string) => void
}

export function StayPhotosCard({ photos, photoType, onRetake }: StayPhotosCardProps) {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})

  const handleDelete = async (photoId: string) => {
    if (photoType === 'checkout') {
      await client.models.CheckoutPhoto.delete({ id: photoId })
    } else {
      await client.models.CheckinPhoto.delete({ id: photoId })
    }
  }

  useEffect(() => {
    const loadPhotoUrls = async () => {
      if (!photos) return
      const urls: Record<string, string> = {}
      for (const photo of photos) {
        urls[photo.id] = await getPhotoUrl(photo.s3Key)
      }
      setPhotoUrls(urls)
    }
    loadPhotoUrls()
  }, [photos])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Photos for This Stay</CardTitle>
      </CardHeader>
      <CardContent>
        {photos && photos.length > 0 ? (
          <div className="space-y-2">
            {photos.map((photo) => (
              <div key={photo.id} className="flex items-center gap-3 p-2 border rounded">
                {photoUrls[photo.id] && (
                  <img
                    src={photoUrls[photo.id]}
                    alt={photo.roomName || 'Room'}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{photo.roomName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onRetake && photo.roomName && (
                    <Button
                      variant="outline"
                      onClick={() => onRetake(photo.roomName!)}
                      className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-3 py-1 text-xs"
                    >
                      Retake
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(photo.id)}
                    className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No photos taken yet</p>
        )}
      </CardContent>
    </Card>
  )
}
