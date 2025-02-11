import { useQuery } from '@tanstack/react-query'

import {
  GetDelegatorPeriodDelegationsOnValidatorParams,
  GetDelegatorPeriodDelegationsOnValidatorResponse,
} from '@/lib/types/delegatorApiTypes'

import { getDelegatorPeriodDelegationsOnValidator } from '../api/delegatorApi'

export function useDelegatorPeriodDelegationsOnValidator(params: GetDelegatorPeriodDelegationsOnValidatorParams) {
  return useQuery<GetDelegatorPeriodDelegationsOnValidatorResponse>({
    queryKey: ['delegatorPeriodDelegationsOnValidator', params.delegatorAddr, params.validatorAddr],
    queryFn: async () => getDelegatorPeriodDelegationsOnValidator(params),
    enabled: !!params.validatorAddr || !!params.delegatorAddr,
  })
}
