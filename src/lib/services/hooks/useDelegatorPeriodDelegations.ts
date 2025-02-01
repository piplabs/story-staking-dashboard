import { useQuery } from '@tanstack/react-query'

import { GetDelegatorPeriodDelegationsParams } from '@/lib/types/delegatorApiTypes'

import { getDelegatorPeriodDelegationsOnValidator } from '../api/delegatorApi'
import { useDelegatorDelegations } from './useDelegatorDelegations'
import { Delegation, DelegationBalance, PeriodDelegation } from '@/lib/types'
import { Address } from 'viem'

export type GetDelegatorPeriodDelegationsResponse = {
  balance: DelegationBalance
  validatorAddr: Address
  delegation: Delegation
  periodDelegation: PeriodDelegation
}[]

export function useDelegatorPeriodDelegations(params: GetDelegatorPeriodDelegationsParams) {
  const { data: delegatorDelegations } = useDelegatorDelegations({
    delegatorAddr: params.delegatorAddr,
  })

  return useQuery<GetDelegatorPeriodDelegationsResponse>({
    queryKey: ['delegatorPeriodDelegations', params.delegatorAddr, params.sortDescending],
    queryFn: async () => {
      if (!delegatorDelegations) return []

      // Map delegations and fetch period delegations
      const validatorDelegationsMap = new Map<string, any>()

      // Process each delegation response
      await Promise.all(
        delegatorDelegations.delegation_responses.map(async (delegationResponse) => {
          const validatorAddr = delegationResponse.delegation.validator_address
          const delegatorAddr = delegationResponse.delegation.delegator_address.evm_address

          // Initialize validator entry if not exists
          if (!validatorDelegationsMap.has(validatorAddr)) {
            validatorDelegationsMap.set(validatorAddr, {
              validatorAddr: validatorAddr,
              balance: delegationResponse.balance,
              delegation: delegationResponse.delegation,
              periodDelegations: [],
            })
          }

          const periodDelegationsData = await getDelegatorPeriodDelegationsOnValidator({
            validatorAddr,
            delegatorAddr,
          })

          // Add period delegations data to map
          const validatorDelegations = validatorDelegationsMap.get(validatorAddr)
          if (validatorDelegations) {
            validatorDelegations.periodDelegations = periodDelegationsData
          }
        })
      )
      console.log(Array.from(validatorDelegationsMap.values()))
      return Array.from(validatorDelegationsMap.values())
    },
    staleTime: 0,
    enabled: !!params.delegatorAddr && !!delegatorDelegations,
  })
}
