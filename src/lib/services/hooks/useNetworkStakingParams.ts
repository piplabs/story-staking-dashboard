'use client'

import { GetNetworkStakingParamsResponse } from './../../types/networkApiTypes'
import { useQuery } from '@tanstack/react-query'
import { getNetworkStakingParams } from '../api/networkApi'

export function useNetworkStakingParams() {
  return useQuery<GetNetworkStakingParamsResponse>({
    queryKey: ['stakingParams'],
    queryFn: () => getNetworkStakingParams(),
  })
}
