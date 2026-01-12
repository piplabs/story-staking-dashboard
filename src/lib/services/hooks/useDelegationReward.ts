import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { getDelegationReward } from '@/lib/services/api/delegatorApi'
import { GetDelegationRewardResponse } from '@/lib/types/delegatorApiTypes'

type UseDelegationRewardParams = {
  delegatorAddr: Address | undefined
  validatorAddr: string | undefined
  periodDelegationId: string | undefined
}

/**
 * Hook to fetch a single delegation reward by period delegation ID
 */
export function useDelegationReward(params: UseDelegationRewardParams) {
  return useQuery<GetDelegationRewardResponse>({
    queryKey: ['delegationReward', params.delegatorAddr, params.validatorAddr, params.periodDelegationId],
    queryFn: () =>
      getDelegationReward({
        delegatorAddr: params.delegatorAddr!,
        validatorAddr: params.validatorAddr!,
        periodDelegationId: params.periodDelegationId!,
      }),
    enabled: !!params.delegatorAddr && !!params.validatorAddr && !!params.periodDelegationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })
}

