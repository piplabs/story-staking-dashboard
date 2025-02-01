import { useQuery } from '@tanstack/react-query'

import { GetDelegatorDelegationsResponse } from '@/lib/types/delegatorApiTypes'

import { GetDelegatorDelegationsParams, getDelegatorDelegations } from '../api/delegatorApi'

export function useDelegatorDelegations(params: GetDelegatorDelegationsParams) {
  return useQuery<GetDelegatorDelegationsResponse>({
    queryKey: ['delegatorDelegations', params.delegatorAddr],
    queryFn: () => getDelegatorDelegations(params),
    staleTime: 0,
  })
}
