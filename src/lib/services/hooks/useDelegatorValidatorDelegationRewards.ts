import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { getDelegatorValidatorDelegationRewards } from '@/lib/services/api/delegatorApi'
import { GetDelegatorValidatorDelegationRewardsResponse } from '@/lib/types/delegatorApiTypes'

type UseDelegatorValidatorDelegationRewardsParams = {
  delegatorAddr: Address | undefined
  validatorAddr: string | undefined
}

/**
 * Hook to fetch delegation rewards for a delegator-validator pair
 */
export function useDelegatorValidatorDelegationRewards(params: UseDelegatorValidatorDelegationRewardsParams) {
  return useQuery<GetDelegatorValidatorDelegationRewardsResponse>({
    queryKey: ['delegatorValidatorDelegationRewards', params.delegatorAddr, params.validatorAddr],
    queryFn: () =>
      getDelegatorValidatorDelegationRewards({
        delegatorAddr: params.delegatorAddr!,
        validatorAddr: params.validatorAddr!,
      }),
    enabled: !!params.delegatorAddr && !!params.validatorAddr,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })
}

