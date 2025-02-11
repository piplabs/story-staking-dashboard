import { useQuery } from '@tanstack/react-query'

import { GetDelegatorRewardsParams, GetDelegatorRewardsResponse } from '@/lib/types/delegatorApiTypes'

import { getDelegatorRewards } from '../api/delegatorApi'

export function useDelegatorRewards(params: GetDelegatorRewardsParams) {
  return useQuery<GetDelegatorRewardsResponse>({
    queryKey: ['delegatorTotalRewards', params],
    queryFn: () => getDelegatorRewards(params),
  })
}
