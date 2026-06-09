'use client'

import { useQuery } from '@tanstack/react-query'

import { AllValidators, GetAllValidatorsParams } from '../../types/validatorApiTypes'
import { getAllValidators } from '../api/validatorApi'

export function useAllValidators(params: GetAllValidatorsParams) {
  return useQuery<AllValidators, Error>({
    queryKey: ['allValidators', params.sortDescending, params.tokenType, params.sortSupportedToken, params.randomSort],
    queryFn: () => getAllValidators(params),
    // React Query's staleTime is in milliseconds. The previous value (60 * 5)
    // was 300ms, which forced an upstream fetch on virtually every render and
    // is almost certainly a units bug. 5 minutes matches the intent.
    staleTime: 5 * 60 * 1000,
  })
}
