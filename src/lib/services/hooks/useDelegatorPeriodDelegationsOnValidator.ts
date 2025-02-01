import { useQuery } from '@tanstack/react-query'

import { PeriodDelegation } from '@/lib/types'
import { GetDelegatorPeriodDelegationsOnValidatorParams } from '@/lib/types/delegatorApiTypes'

import { getDelegatorPeriodDelegationsOnValidator } from '../api/delegatorApi'

export function useDelegatorPeriodDelegationsOnValidator(
  params: GetDelegatorPeriodDelegationsOnValidatorParams
) {
  return useQuery<PeriodDelegation[]>({
    queryKey: ['delegatorPeriodDelegationsOnValidator', params.delegatorAddr, params.validatorAddr],
    queryFn: async () => getDelegatorPeriodDelegationsOnValidator(params),
    enabled: !!params.validatorAddr || !!params.delegatorAddr,
  })
}
