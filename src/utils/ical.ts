export type ICalEvent = {
  checkInDate: string
  checkOutDate: string
  confirmationCode: string | null
  phoneLastFour: string | null
}

export async function parseICalFeed(url: string): Promise<ICalEvent[]> {
  const { LambdaClient, InvokeCommand } = await import('@aws-sdk/client-lambda')
  const { fetchAuthSession } = await import('aws-amplify/auth')
  const outputs = await import('../../amplify_outputs.json')

  const functionName = outputs.custom?.fetchIcalFunctionName

  console.log('Function name:', functionName)

  if (!functionName) {
    throw new Error('fetchIcalFunctionName not found in config')
  }

  const session = await fetchAuthSession()

  if (!session.credentials) {
    throw new Error('No credentials available')
  }

  const lambda = new LambdaClient({
    region: 'us-west-2',
    credentials: session.credentials,
  })

  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: new TextEncoder().encode(JSON.stringify({ url })),
  })

  const response = await lambda.send(command)

  if (!response.Payload) {
    throw new Error('No payload in Lambda response')
  }

  const result = JSON.parse(new TextDecoder().decode(response.Payload))
  const text = result.body

  const events: ICalEvent[] = []
  const lines = text.split('\n')

  let currentEvent: Partial<ICalEvent> | null = null
  let isReservation = false
  let currentDescription = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === 'BEGIN:VEVENT') {
      currentEvent = {}
      isReservation = false
      currentDescription = ''
    } else if (trimmed === 'END:VEVENT' && currentEvent && isReservation) {
      if (currentEvent.checkInDate && currentEvent.checkOutDate) {
        // Convert YYYYMMDD to YYYY-MM-DD
        const formatDate = (date: string) => {
          if (date.length === 8) {
            return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
          }
          return date
        }

        currentEvent.checkInDate = formatDate(currentEvent.checkInDate)
        currentEvent.checkOutDate = formatDate(currentEvent.checkOutDate)

        events.push(currentEvent as ICalEvent)
      }
      currentEvent = null
      currentDescription = ''
    } else if (currentEvent) {
      if (trimmed.startsWith('DTSTART;VALUE=DATE:')) {
        currentEvent.checkInDate = trimmed.split(':')[1]
      } else if (trimmed.startsWith('DTEND;VALUE=DATE:')) {
        currentEvent.checkOutDate = trimmed.split(':')[1]
      } else if (trimmed === 'SUMMARY:Reserved') {
        isReservation = true
      } else if (trimmed.startsWith('DESCRIPTION:')) {
        currentDescription = trimmed.substring('DESCRIPTION:'.length)
        // Check for continuation lines (start with space)
        while (i + 1 < lines.length && lines[i + 1].startsWith(' ')) {
          i++
          currentDescription += lines[i].substring(1)
        }
        const codeMatch = currentDescription.match(/details\/([A-Z0-9]+)/)
        const phoneMatch = currentDescription.match(/Last 4 Digits\): (\d{4})/)
        currentEvent.confirmationCode = codeMatch ? codeMatch[1] : null
        currentEvent.phoneLastFour = phoneMatch ? phoneMatch[1] : null
      }
    }
  }

  return events
}
