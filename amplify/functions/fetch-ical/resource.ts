import { defineFunction } from '@aws-amplify/backend'

export const fetchIcal = defineFunction({
  name: 'fetch-ical',
  entry: './handler.ts',
})
