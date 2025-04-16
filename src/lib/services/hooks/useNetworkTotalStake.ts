import { useQuery } from '@tanstack/react-query'
import { getNetworkTotalStake } from '@/lib/services/api/networkApi'
import { GetNetworkTotalStakeResponse } from '@/lib/types/networkApiTypes'

export function useNetworkTotalStake() {
  return useQuery<GetNetworkTotalStakeResponse>({
    queryKey: ['networkTotalStake'],
    queryFn: getNetworkTotalStake,
    staleTime: 5000 * 60, // 5 minutes
    refetchInterval: 5000 * 60, // 5 minutes
  })
}
