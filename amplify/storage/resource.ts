import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'turnoverPhotos',
  access: (allow) => ({
    'checkout/{date}/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'checkin/{date}/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
})
