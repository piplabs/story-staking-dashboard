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
  GetDelegatorValidatorRewardsParams,
  GetDelegatorValidatorRewardsApiResponse,
  GetDelegatorValidatorRewardsResponse,
  GetDelegatorValidatorDelegationRewardsParams,
  GetDelegatorValidatorDelegationRewardsApiResponse,
  GetDelegatorValidatorDelegationRewardsResponse,
  GetDelegationRewardParams,
  GetDelegationRewardApiResponse,
  GetDelegationRewardResponse,
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
export async function getDelegatorRewards(params: GetDelegatorRewardsParams): Promise<GetDelegatorRewardsResponse> {
  const response = await stakingDataAxios.get<GetDelegatorRewardsApiResponse>(`/rewards/${params.delegatorAddr}`)

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch total rewards')
  }

  const rewards = response.data.msg

  if (!rewards.amount) {
    return {
      accumulatedRewards: '0',
      lastUpdateHeight: rewards.last_update_height,
    }
  }

  const accumulatedRewards = formatEther(BigInt(rewards.amount), 'gwei')

  return {
    accumulatedRewards: accumulatedRewards,
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

/**
 * Get lifetime accrued rewards for a delegator-validator pair
 * GET /api/rewards/:delegator_address/:validator_address
 */
export async function getDelegatorValidatorRewards(
  params: GetDelegatorValidatorRewardsParams
): Promise<GetDelegatorValidatorRewardsResponse> {
  const response = await stakingDataAxios.get<GetDelegatorValidatorRewardsApiResponse>(
    `/rewards/${params.delegatorAddr}/${params.validatorAddr}`
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch delegator-validator rewards')
  }

  const msg = response.data.msg

  return {
    delegatorAddress: msg.delegator_address,
    validatorAddress: msg.validator_address,
    claimedAmount: formatEther(BigInt(msg.claimed_amount || '0'), 'gwei'),
    unclaimedAmount: formatEther(BigInt(msg.unclaimed_amount || '0'), 'gwei'),
    lastUpdateHeight: msg.last_update_height,
  }
}

/**
 * Get delegation rewards by delegator-validator pair
 * GET /api/rewards/:delegator_address/:validator_address/delegations
 */
export async function getDelegatorValidatorDelegationRewards(
  params: GetDelegatorValidatorDelegationRewardsParams
): Promise<GetDelegatorValidatorDelegationRewardsResponse> {
  const response = await stakingDataAxios.get<GetDelegatorValidatorDelegationRewardsApiResponse>(
    `/rewards/${params.delegatorAddr}/${params.validatorAddr}/delegations`
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch delegator-validator delegation rewards')
  }

  const msg = response.data.msg

  return {
    delegatorAddress: msg.delegator_address,
    validatorAddress: msg.validator_address,
    delegations: msg.delegations.map((d) => ({
      delegatorAddress: d.delegator_address,
      validatorAddress: d.validator_address,
      periodDelegationId: d.period_delegation_id,
      periodType: d.period_type,
      status: d.status,
      rewardShares: d.reward_shares,
      claimedAmount: formatEther(BigInt(d.claimed_amount || '0'), 'gwei'),
      unclaimedAmount: formatEther(BigInt(d.unclaimed_amount || '0'), 'gwei'),
      lastUpdateHeight: d.last_update_height,
    })),
    totalRewards: formatEther(BigInt(msg.total_rewards || '0'), 'gwei'),
  }
}

/**
 * Get single delegation reward by period delegation ID
 * GET /api/rewards/:delegator_address/:validator_address/delegations/:period_delegation_id
 */
export async function getDelegationReward(params: GetDelegationRewardParams): Promise<GetDelegationRewardResponse> {
  const response = await stakingDataAxios.get<GetDelegationRewardApiResponse>(
    `/rewards/${params.delegatorAddr}/${params.validatorAddr}/delegations/${params.periodDelegationId}`
  )

  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch delegation reward')
  }

  const msg = response.data.msg

  return {
    delegatorAddress: msg.delegator_address,
    validatorAddress: msg.validator_address,
    periodDelegationId: msg.period_delegation_id,
    periodType: msg.period_type,
    status: msg.status,
    rewardShares: msg.reward_shares,
    claimedAmount: formatEther(BigInt(msg.claimed_amount || '0'), 'gwei'),
    unclaimedAmount: formatEther(BigInt(msg.unclaimed_amount || '0'), 'gwei'),
    lastUpdateHeight: msg.last_update_height,
  }
}
