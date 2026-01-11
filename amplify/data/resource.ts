import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Listing: a
    .model({
      name: a.string().required(),
      address: a.string(),
      notes: a.string(),
      rooms: a.string().array(),
      icalUrl: a.string(),
      stays: a.hasMany('Stay', 'listingId'),
    })
    .authorization((allow) => [allow.authenticated()]),

  Stay: a
    .model({
      listingId: a.id().required(),
      listing: a.belongsTo('Listing', 'listingId'),
      guestName: a.string(),
      checkInDate: a.date().required(),
      checkOutDate: a.date().required(),
      confirmationCode: a.string(),
      notes: a.string(),
      checkoutPhotos: a.hasMany('CheckoutPhoto', 'stayId'),
      checkinPhotos: a.hasMany('CheckinPhoto', 'stayId'),
    })
    .authorization((allow) => [allow.authenticated()]),

  CheckoutPhoto: a
    .model({
      stayId: a.id().required(),
      stay: a.belongsTo('Stay', 'stayId'),
      s3Key: a.string().required(),
      roomName: a.string(),
      notes: a.string(),
      capturedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  CheckinPhoto: a
    .model({
      stayId: a.id().required(),
      stay: a.belongsTo('Stay', 'stayId'),
      s3Key: a.string().required(),
      roomName: a.string(),
      notes: a.string(),
      capturedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
