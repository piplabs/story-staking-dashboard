'use client'

import { useQuery } from '@tanstack/react-query'

import { GetStakingPoolResponse } from '@/lib/types/networkApiTypes'

import { getStakingPool } from '../api/networkApi'

export function useStakingPool() {
  return useQuery<GetStakingPoolResponse>({
    queryKey: ['stakingPool'],
    queryFn: () => getStakingPool(),
  })
}
