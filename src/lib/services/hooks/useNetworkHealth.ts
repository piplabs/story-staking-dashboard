import { useQuery } from '@tanstack/react-query'

import { GetNetworkHealthResponse } from '@/lib/types/networkApiTypes'

import { getNetworkHealth } from '../api/networkApi'

export default function useNetworkHealth() {
  return useQuery<GetNetworkHealthResponse>({
    queryKey: ['networkHealth'],
    queryFn: getNetworkHealth,
  })
}
