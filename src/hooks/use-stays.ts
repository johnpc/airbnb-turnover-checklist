import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/data-client'
import type { Schema } from '../../amplify/data/resource'
import { useEffect } from 'react'

type CreateStayInput = Schema['Stay']['createType']

export function useStays(listingId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkoutSub = client.models.CheckoutPhoto.observeQuery().subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['stays', listingId] })
      },
    })

    const checkinSub = client.models.CheckinPhoto.observeQuery().subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['stays', listingId] })
      },
    })

    return () => {
      checkoutSub.unsubscribe()
      checkinSub.unsubscribe()
    }
  }, [listingId, queryClient])

  return useQuery({
    queryKey: ['stays', listingId],
    queryFn: async () => {
      const { data } = await client.models.Stay.list({
        filter: { listingId: { eq: listingId } },
      })
      return data.sort(
        (a, b) => new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime()
      )
    },
  })
}

export function useStay(stayId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkoutSub = client.models.CheckoutPhoto.observeQuery().subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['stay', stayId] })
      },
    })

    const checkinSub = client.models.CheckinPhoto.observeQuery().subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['stay', stayId] })
      },
    })

    return () => {
      checkoutSub.unsubscribe()
      checkinSub.unsubscribe()
    }
  }, [stayId, queryClient])

  return useQuery({
    queryKey: ['stay', stayId],
    queryFn: async () => {
      const { data } = await client.models.Stay.get({ id: stayId })
      return data
    },
    enabled: !!stayId,
  })
}

export function useCreateStay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateStayInput) => {
      const { data } = await client.models.Stay.create(input)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stays', variables.listingId] })
    },
  })
}
