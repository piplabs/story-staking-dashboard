import { useQuery } from '@tanstack/react-query'

import { GetEvmOperationsParams, GetEvmOperationsResponse } from '@/lib/types/networkApiTypes'

import { getEvmOperations } from '../api/networkApi'

export const useEvmOperations = (params: GetEvmOperationsParams) => {
  return useQuery<GetEvmOperationsResponse>({
    queryKey: ['evmOperations', params],
    queryFn: () => getEvmOperations(params),
    staleTime: 0,
  })
}
