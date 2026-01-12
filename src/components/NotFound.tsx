import { AlertCircle, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'

type NotFoundProps = {
  title?: string
  message?: string
}

export function NotFound({
  title = 'Uh oh...',
  message = "We couldn't find what you're looking for.",
}: NotFoundProps) {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="p-8 sm:p-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-purple-500 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={() => navigate('/')} className="gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </Card>
    </div>
  )
}
