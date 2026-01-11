import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/data-client'
import type { Schema } from '../../amplify/data/resource'

type CreateListingInput = Schema['Listing']['createType']

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data } = await client.models.Listing.list()
      return data
    },
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateListingInput) => {
      const { data } = await client.models.Listing.create(input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.models.Listing.delete({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
