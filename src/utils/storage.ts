import { uploadData, getUrl } from 'aws-amplify/storage'
import { getDateKey } from './date'

export async function uploadPhoto(
  file: File,
  type: 'checkout' | 'checkin',
  roomName: string
): Promise<string> {
  const dateKey = getDateKey()
  const timestamp = Date.now()
  const key = `${type}/${dateKey}/${roomName}-${timestamp}.${file.name.split('.').pop()}`

  await uploadData({
    path: key,
    data: file,
  }).result

  return key
}

export async function getPhotoUrl(key: string): Promise<string> {
  const result = await getUrl({ path: key })
  return result.url.toString()
}
