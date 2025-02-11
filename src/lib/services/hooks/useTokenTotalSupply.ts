import { useQuery } from '@tanstack/react-query'

import { getTokenTotalSupply } from '../api/networkApi'
import { GetTokenTotalSupplyParams, GetTokenTotalSupplyResponse } from './../../types/networkApiTypes'

export function useTokenTotalSupply(params: GetTokenTotalSupplyParams) {
  return useQuery<GetTokenTotalSupplyResponse>({
    queryKey: ['tokenTotalSupply', params.denom],
    queryFn: () => getTokenTotalSupply(params),
  })
}
