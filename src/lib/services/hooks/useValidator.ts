'use client'

import { useQuery } from '@tanstack/react-query'

import { GetValidatorParams } from '@/lib/types/validatorApiTypes'

import { Validator } from '../../types'
import { getValidator } from '../api/validatorApi'

export function useValidator(params: GetValidatorParams) {
  return useQuery<Validator>({
    queryKey: ['validator', params.validatorAddr],
    queryFn: () => getValidator(params),
  })
}
