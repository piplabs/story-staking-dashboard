import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import {
  GetUnbondedDelegatorDelegationsParams,
  GetUnbondedDelegatorDelegationsResponse,
} from '@/lib/types/delegatorApiTypes'

import { getUnbondedDelegatorDelegations } from '../api/delegatorApi'

export function useUnbondedDelegatorDelegations(params: GetUnbondedDelegatorDelegationsParams) {
  return useQuery<GetUnbondedDelegatorDelegationsResponse>({
    queryKey: ['unbondedDelegatorDelegations', params.delegatorAddr],
    queryFn: () => getUnbondedDelegatorDelegations({ delegatorAddr: params.delegatorAddr }),
    staleTime: 0,
  })
}
