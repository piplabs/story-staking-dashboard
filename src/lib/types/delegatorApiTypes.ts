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
