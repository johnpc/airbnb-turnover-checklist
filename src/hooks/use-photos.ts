import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/data-client'
import type { Schema } from '../../amplify/data/resource'
import { useEffect } from 'react'

type CreateCheckoutPhotoInput = Schema['CheckoutPhoto']['createType']
type CreateCheckinPhotoInput = Schema['CheckinPhoto']['createType']

export function useCheckoutPhotos(stayId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const sub = client.models.CheckoutPhoto.observeQuery({
      filter: { stayId: { eq: stayId } },
    }).subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['checkoutPhotos', stayId] })
      },
    })

    return () => sub.unsubscribe()
  }, [stayId, queryClient])

  return useQuery({
    queryKey: ['checkoutPhotos', stayId],
    queryFn: async () => {
      const { data } = await client.models.CheckoutPhoto.list({
        filter: { stayId: { eq: stayId } },
      })
      return data
    },
  })
}

export function useCheckinPhotos(stayId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const sub = client.models.CheckinPhoto.observeQuery({
      filter: { stayId: { eq: stayId } },
    }).subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['checkinPhotos', stayId] })
      },
    })

    return () => sub.unsubscribe()
  }, [stayId, queryClient])

  return useQuery({
    queryKey: ['checkinPhotos', stayId],
    queryFn: async () => {
      const { data } = await client.models.CheckinPhoto.list({
        filter: { stayId: { eq: stayId } },
      })
      return data
    },
  })
}

export function useCreateCheckoutPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateCheckoutPhotoInput) => {
      const { data } = await client.models.CheckoutPhoto.create(input)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checkoutPhotos', variables.stayId] })
    },
  })
}

export function useCreateCheckinPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateCheckinPhotoInput) => {
      const { data } = await client.models.CheckinPhoto.create(input)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checkinPhotos', variables.stayId] })
    },
  })
}
