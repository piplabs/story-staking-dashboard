import { useQuery } from '@tanstack/react-query'

import {
  GetValidatorDelegationsParams,
  GetValidatorDelegationsResponse,
} from '@/lib/types/validatorApiTypes'

import { getValidatorDelegations } from '../api/validatorApi'

export function useValidatorDelegations(params: GetValidatorDelegationsParams) {
  return useQuery<GetValidatorDelegationsResponse | undefined>({
    queryKey: ['validatorDelegations', params.validatorAddr, params.sortDescending],
    queryFn: () => getValidatorDelegations(params),
    staleTime: 0,
  })
}
