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

export type GetDelegatorPeriodDelegationsApiResponse = {
  code: number
  msg: PeriodDelegation[]
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
    rewards: string
    type: string
  }
  error: string
}

export type GetDelegatorRewardsResponse = {
  accumulatedRewards: bigint
  type: string
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

export type GetDelegatorPeriodDelegationsResponse = {
  validatorAddr: Address
  balance: DelegationBalance
  delegation: Delegation
  periodDelegations: PeriodDelegation[]
}
