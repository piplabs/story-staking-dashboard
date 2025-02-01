import { useQuery } from '@tanstack/react-query'

import { GetAprResponse } from '@/lib/types/networkApiTypes'

import { getApr } from '../api/networkApi'

export default function useApr() {
  return useQuery<GetAprResponse>({
    queryKey: ['apr'],
    queryFn: getApr,
  })
}
