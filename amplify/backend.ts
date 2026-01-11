import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { fetchIcal } from './functions/fetch-ical/resource'

const backend = defineBackend({
  auth,
  data,
  storage,
  fetchIcal,
})

backend.fetchIcal.resources.lambda.grantInvoke(backend.auth.resources.authenticatedUserIamRole)

backend.addOutput({
  custom: {
    fetchIcalFunctionName: backend.fetchIcal.resources.lambda.functionName,
  },
})
