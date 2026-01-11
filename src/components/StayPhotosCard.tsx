import { useEffect, useState } from 'react'
import { getPhotoUrl } from '@/utils/storage'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Photo = {
  id: string
  roomName: string | null
  s3Key: string
}

type StayPhotosCardProps = {
  photos: Photo[] | undefined
  onRetake?: (roomName: string) => void
}

export function StayPhotosCard({ photos, onRetake }: StayPhotosCardProps) {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})

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
                <span className="font-medium flex-1">{photo.roomName}</span>
                {onRetake && photo.roomName && (
                  <Button variant="outline" onClick={() => onRetake(photo.roomName!)}>
                    Retake
                  </Button>
                )}
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
