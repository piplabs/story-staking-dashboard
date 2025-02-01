'use client'

import { useQuery } from '@tanstack/react-query'

import { AllValidators, GetAllValidatorsParams } from '../../types/validatorApiTypes'
import { getAllValidators } from '../api/validatorApi'

export function useAllValidators(params: GetAllValidatorsParams) {
  return useQuery<AllValidators, Error>({
    queryKey: ['allValidators', params.sortDescending, params.tokenType],
    queryFn: () => getAllValidators(params),
    // staleTime: 1000 * 60 * 5,
  })
}
