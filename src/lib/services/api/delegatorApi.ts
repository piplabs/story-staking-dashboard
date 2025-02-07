import { Address, formatEther } from 'viem'

import { stakingDataAxios } from '@/lib/services/api'
import { ApiResponsePagination, DelegationBalance, PeriodDelegation } from '@/lib/types'
import {
  GetDelegatorDelegationsApiResponse,
  GetDelegatorDelegationsResponse,
  GetDelegatorPeriodDelegationsApiResponse,
  GetDelegatorPeriodDelegationsOnValidatorParams,
  GetDelegatorRewardsApiResponse,
  GetDelegatorRewardsParams,
  GetDelegatorRewardsResponse,
  GetValidatorDelegatorDelegationsParams,
  GetUnbondedDelegatorDelegationsApiResponse,
  GetUnbondedDelegatorDelegationsParams,
  GetUnbondedDelegatorDelegationsResponse,
  GetValidatorDelegatorDelegationsResponse,
  GetValidatorDelegatorDelegationApiResponse,
  GetDelegatorPeriodDelegationsOnValidatorApiResponse,
  GetDelegatorPeriodDelegationsOnValidatorResponse,
} from '@/lib/types/delegatorApiTypes'

export async function getValidatorDelegatorDelegations(
  params: GetValidatorDelegatorDelegationsParams
): Promise<GetValidatorDelegatorDelegationsResponse> {
  const response = await stakingDataAxios.get<GetValidatorDelegatorDelegationApiResponse>(
    `/staking/validators/${params.validatorAddr}/delegations/${params.delegatorAddr}`
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch delegator stake')
  }

  return {
    delegation_response: response.data.msg.delegation_response,
    pagination: null,
  }
}

// Get delegator's period delegations for a specific validator
export async function getDelegatorPeriodDelegationsOnValidator(
  params: GetDelegatorPeriodDelegationsOnValidatorParams
): Promise<GetDelegatorPeriodDelegationsOnValidatorResponse> {
  const response = await stakingDataAxios.get<GetDelegatorPeriodDelegationsOnValidatorApiResponse>(
    `/staking/validators/${params.validatorAddr}/delegators/${params.delegatorAddr}/period_delegations`
  )

  // if (response.data.code !== 200) {
  //   throw new Error(response.data.error || 'Failed to fetch period delegations')
  // }
  return response.data.msg
}

export type GetDelegatorDelegationsParams = {
  delegatorAddr: Address
}

export async function getDelegatorDelegations(
  params: GetDelegatorDelegationsParams
): Promise<GetDelegatorDelegationsResponse> {
  const response = await stakingDataAxios.get<GetDelegatorDelegationsApiResponse>(
    `/staking/delegations/${params.delegatorAddr}`,
    {
      params: {
        'pagination.limit': 100000,
        'pagination.count_total': true,
      },
    }
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch delegator delegations')
  }

  return {
    delegation_responses: response.data.msg.delegation_responses,
    pagination: response.data.msg.pagination,
  }
}
export async function getDelegatorRewards(
  params: GetDelegatorRewardsParams
): Promise<GetDelegatorRewardsResponse> {
  const response = await stakingDataAxios.get<GetDelegatorRewardsApiResponse>(
    `/rewards/${params.delegatorAddr}`
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch total rewards')
  }

  const rewards = response.data.msg

  if (rewards.amount.includes('e')) {
    const [mantissa, exponent] = rewards.amount.split('e')
    const exp = parseInt(exponent)
    const value = parseFloat(mantissa) * Math.pow(10, exp)
    return {
      accumulatedRewards: BigInt(formatEther(BigInt(Math.floor(value)), 'gwei')),
      lastUpdateHeight: rewards.last_update_height,
    }
  }

  return {
    accumulatedRewards: BigInt(formatEther(BigInt(rewards.amount), 'gwei')),
    lastUpdateHeight: rewards.last_update_height,
  }
}

export async function getUnbondedDelegatorDelegations(
  params: GetUnbondedDelegatorDelegationsParams
): Promise<GetUnbondedDelegatorDelegationsResponse> {
  const response = await stakingDataAxios
    .get<GetUnbondedDelegatorDelegationsApiResponse>(
      `/staking/delegators/${params.delegatorAddr}/unbonding_delegations`
    )
    .then((r) => r.data)

  if (response.code !== 200) {
    throw new Error(response.error || 'Failed to fetch unbonded delegator delegations')
  }

  return response.msg
}
