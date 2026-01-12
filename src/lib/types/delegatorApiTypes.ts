import { Address } from 'viem'

import { ApiResponsePagination, Delegation, DelegationBalance, PeriodDelegation } from '.'

export type DelegationResponse = {
  delegation: Delegation
  balance: DelegationBalance
}

export type GetDelegatorDelegationsApiResponse = {
  code: number
  msg: {
    delegation_responses: DelegationResponse[]
    pagination: ApiResponsePagination
  }
  error: string
}

export type GetValidatorDelegatorDelegationsParams = {
  validatorAddr: string
  delegatorAddr: Address
}
export type GetValidatorDelegatorDelegationsResponse = {
  delegation_response: DelegationResponse
  pagination: ApiResponsePagination
}

export type GetDelegatorDelegationsResponse = {
  delegation_responses: {
    delegation: Delegation
    balance: DelegationBalance
  }[]
  pagination: ApiResponsePagination
}

export type GetDelegatorPeriodDelegationsResponse = {
  periodDelegations: {
    balance: DelegationBalance
    period_delegation_responses: PeriodDelegation[]
  }
  pagination: ApiResponsePagination
}

export type GetDelegatorPeriodDelegationsApiResponse = {
  code: number
  msg: GetDelegatorPeriodDelegationsResponse
  error: string
}

export type GetDelegatorPeriodDelegationsOnValidatorResponse = {
  // balance: DelegationBalance
  period_delegation_responses: {
    balance: DelegationBalance
    period_delegation: PeriodDelegation
  }[]
  pagination: ApiResponsePagination
}

export type GetDelegatorPeriodDelegationsOnValidatorApiResponse = {
  code: number
  msg: GetDelegatorPeriodDelegationsOnValidatorResponse
  error: string
}

export type GetDelegatorTotalRewardsApiResponse = {
  code: number
  msg: {
    accumulated_rewards: string
  }
  error: string
}

export type GetValidatorDelegatorDelegationApiResponse = {
  code: number
  msg: {
    delegation_response: DelegationResponse
  }
  error: string
}

export type GetDelegatorRewardsApiResponse = {
  code: number
  msg: {
    address: Address
    amount: string
    last_update_height: number
  }
  error: string
}

export type GetDelegatorRewardsResponse = {
  accumulatedRewards: string
  lastUpdateHeight: number
}

export type GetDelegatorRewardsParams = {
  delegatorAddr: Address
}

export type GetDelegatorPeriodDelegationsOnValidatorParams = {
  validatorAddr: string
  delegatorAddr: Address
}

export type GetDelegatorDelegationApiResponse = {
  code: number
  msg: {
    delegation_response: {
      delegation: Delegation
      balance: DelegationBalance
    }
  }
  error: string
}

/*
	Get unbonded delegator delegations
*/
export type GetUnbondedDelegatorDelegationsParams = {
  delegatorAddr: Address
}

type UnbondingDelegations = {
  delegator_address: string
  validator_address: string
  entries: {
    creation_height: string
    completion_time: string
    initial_balance: string
    balance: string
    unbonding_id: string
  }[]
}

export type GetUnbondedDelegatorDelegationsResponse = {
  unbonding_responses: UnbondingDelegations[]
  pagination: ApiResponsePagination
}

export type GetUnbondedDelegatorDelegationsApiResponse = {
  code: number
  msg: GetUnbondedDelegatorDelegationsResponse
  error: string
}

export type GetDelegatorPeriodDelegationsParams = {
  delegatorAddr: Address
  sortDescending?: boolean
}

/* 
  Get lifetime rewards for delegator-validator pair
  GET /api/rewards/:delegator_address/:validator_address
*/
export type GetDelegatorValidatorRewardsParams = {
  delegatorAddr: Address
  validatorAddr: string
}

export type GetDelegatorValidatorRewardsApiResponse = {
  code: number
  msg: {
    delegator_address: Address
    validator_address: Address
    claimed_amount: string
    unclaimed_amount: string
    last_update_height: number
  }
  error: string
}

export type GetDelegatorValidatorRewardsResponse = {
  delegatorAddress: Address
  validatorAddress: Address
  claimedAmount: string
  unclaimedAmount: string
  lastUpdateHeight: number
}

/*
  Get delegation rewards for delegator-validator pair
  GET /api/rewards/:delegator_address/:validator_address/delegations
*/
export type GetDelegatorValidatorDelegationRewardsParams = {
  delegatorAddr: Address
  validatorAddr: string
}

export type DelegationRewardInfo = {
  delegator_address: Address
  validator_address: Address
  period_delegation_id: string
  period_type: 0 | 1 | 2 | 3
  status: string
  reward_shares: string
  claimed_amount: string
  unclaimed_amount: string
  last_update_height: number
}

export type GetDelegatorValidatorDelegationRewardsApiResponse = {
  code: number
  msg: {
    delegator_address: Address
    validator_address: Address
    delegations: DelegationRewardInfo[]
    total_rewards: string
  }
  error: string
}

export type GetDelegatorValidatorDelegationRewardsResponse = {
  delegatorAddress: Address
  validatorAddress: Address
  delegations: {
    delegatorAddress: Address
    validatorAddress: Address
    periodDelegationId: string
    periodType: 0 | 1 | 2 | 3
    status: string
    rewardShares: string
    claimedAmount: string
    unclaimedAmount: string
    lastUpdateHeight: number
  }[]
  totalRewards: string
}

/*
  Get single delegation reward by period delegation ID
  GET /api/rewards/:delegator_address/:validator_address/delegations/:period_delegation_id
*/
export type GetDelegationRewardParams = {
  delegatorAddr: Address
  validatorAddr: string
  periodDelegationId: string
}

export type GetDelegationRewardApiResponse = {
  code: number
  msg: DelegationRewardInfo
  error: string
}

export type GetDelegationRewardResponse = {
  delegatorAddress: Address
  validatorAddress: Address
  periodDelegationId: string
  periodType: 0 | 1 | 2 | 3
  status: string
  rewardShares: string
  claimedAmount: string
  unclaimedAmount: string
  lastUpdateHeight: number
}
