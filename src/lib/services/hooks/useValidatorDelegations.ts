import { useQuery } from '@tanstack/react-query'

import {
  GetValidatorDelegationsParams,
  GetValidatorDelegationsResponse,
} from '@/lib/types/validatorApiTypes'

import { getValidatorDelegations } from '../api/validatorApi'

export function useValidatorDelegations(params: GetValidatorDelegationsParams) {
  const paramsWithDefault = {
    ...params,
    sortDescending: params.sortDescending ?? true,
  }

  return useQuery<GetValidatorDelegationsResponse | undefined>({
    queryKey: [
      'validatorDelegations',
      paramsWithDefault.validatorAddr,
      paramsWithDefault.sortDescending,
    ],
    queryFn: () => getValidatorDelegations(paramsWithDefault),
    staleTime: 0,
  })
}
