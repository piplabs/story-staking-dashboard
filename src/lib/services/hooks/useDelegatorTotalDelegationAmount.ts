import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { useDelegatorDelegations } from './useDelegatorDelegations'

export function useDelegatorTotalDelegationAmount({ delegatorAddr }: { delegatorAddr: Address }) {
  const delegationsQuery = useDelegatorDelegations({ delegatorAddr })

  return useQuery({
    queryKey: ['delegatorTotalDelegations', delegatorAddr],
    queryFn: () => {
      if (!delegationsQuery.data) return BigInt(0)

      const totalDelegationAmount = delegationsQuery.data.delegation_responses.reduce(
        (sum, { balance }) => sum + BigInt(balance.amount),
        BigInt(0)
      )
      return totalDelegationAmount
    },
    enabled: !!delegationsQuery.data,
  })
}
