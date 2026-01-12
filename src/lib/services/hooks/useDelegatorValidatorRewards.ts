import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { getDelegatorValidatorRewards } from '@/lib/services/api/delegatorApi'
import { GetDelegatorValidatorRewardsResponse } from '@/lib/types/delegatorApiTypes'

type UseDelegatorValidatorRewardsParams = {
  delegatorAddr: Address | undefined
  validatorAddr: string | undefined
}

/**
 * Hook to fetch lifetime accrued rewards for a delegator-validator pair
 */
export function useDelegatorValidatorRewards(params: UseDelegatorValidatorRewardsParams) {
  return useQuery<GetDelegatorValidatorRewardsResponse>({
    queryKey: ['delegatorValidatorRewards', params.delegatorAddr, params.validatorAddr],
    queryFn: () =>
      getDelegatorValidatorRewards({
        delegatorAddr: params.delegatorAddr!,
        validatorAddr: params.validatorAddr!,
      }),
    enabled: !!params.delegatorAddr && !!params.validatorAddr,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })
}

