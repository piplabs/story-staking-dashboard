import { useQuery } from '@tanstack/react-query'

import { getValidatorDelegatorDelegations } from '../api/delegatorApi'
import {
  GetValidatorDelegatorDelegationsParams,
  GetValidatorDelegatorDelegationsResponse,
} from '@/lib/types/delegatorApiTypes'

export function useValidatorDelegatorDelegations(params: GetValidatorDelegatorDelegationsParams) {
  return useQuery<GetValidatorDelegatorDelegationsResponse>({
    queryKey: ['validatorDelegatorDelegation', params.validatorAddr, params.delegatorAddr],
    queryFn: () => getValidatorDelegatorDelegations(params),
    staleTime: 0,
  })
}
