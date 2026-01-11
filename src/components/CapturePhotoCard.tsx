import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Camera } from 'lucide-react'

type CapturePhotoCardProps = {
  listingName: string
  currentRoomIndex: number
  totalRooms: number
  currentRoom: string
  isUploading: boolean
  isDone?: boolean
  onCapture: () => void
  onCancel: () => void
}

export type CapturePhotoCardRef = {
  videoRef: HTMLVideoElement | null
  canvasRef: HTMLCanvasElement | null
}

export const CapturePhotoCard = forwardRef<CapturePhotoCardRef, CapturePhotoCardProps>(
  (
    {
      listingName,
      currentRoomIndex,
      totalRooms,
      currentRoom,
      isUploading,
      isDone,
      onCapture,
      onCancel,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    useImperativeHandle(ref, () => ({
      videoRef: videoRef.current,
      canvasRef: canvasRef.current,
    }))

    useEffect(() => {
      let mounted = true
      const initCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: 1920, height: 1080 },
          })
          if (mounted && videoRef.current) {
            setStream(mediaStream)
            videoRef.current.srcObject = mediaStream
          }
        } catch (err) {
          console.error('Camera access denied:', err)
        }
      }
      initCamera()

      return () => {
        mounted = false
      }
    }, [])

    useEffect(() => {
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }, [stream])

    return (
      <Card>
        <CardHeader>
          <CardTitle>{listingName}</CardTitle>
          {!isDone && (
            <p className="text-sm text-muted-foreground">
              Room {currentRoomIndex + 1} of {totalRooms}: {currentRoom}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isDone ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">🎉 Congrats! You're Done!</h2>
              <p className="text-muted-foreground mb-6">All photos have been captured</p>
              <Button onClick={onCancel} className="w-full">
                Back to Stay Overview
              </Button>
            </div>
          ) : (
            <>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <Button onClick={onCapture} disabled={isUploading} className="w-full py-6">
                <Camera className="mr-2 h-5 w-5" />
                {isUploading ? 'Uploading...' : 'Capture Photo'}
              </Button>

              <Button variant="outline" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    )
  }
)

CapturePhotoCard.displayName = 'CapturePhotoCard'
