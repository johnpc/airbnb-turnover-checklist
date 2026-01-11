import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'turnoverPhotos',
  access: (allow) => ({
    'checkout/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'checkin/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
})
