import { Address } from 'viem'

import { ApiResponsePagination, Delegation, DelegationBalance, PeriodDelegation, Validator } from '.'

/* 
	Get All Validators
*/
export type GetAllValidatorsParams = {
  status?: string
  tokenType?: 'LOCKED' | 'UNLOCKED' | 'ALL'
  isActiveValidator?: boolean
  sortDescending?: boolean
  sortSupportedToken?: boolean
  filterLockedTokens?: boolean
  randomSort?: boolean
}

export type GetAllValidatorsApiResponse = {
  code: number
  msg: {
    validators: Validator[]
    pagination: ApiResponsePagination
  }
  error: string
}

export type AllValidators = {
  allValidators: Validator[]
  pagination: ApiResponsePagination
}

/* 
	Get Validator
*/
export type GetValidatorParams = {
  validatorAddr: Address
}
export type GetValidatorApiResponse = {
  code: number
  msg: Validator
  error: string
}

/* 
	Get Validator Delegations
*/
export type GetValidatorDelegationsParams = {
  validatorAddr: Address
  sortDescending?: boolean
}

export type GetValidatorDelegationsResponse = {
  delegation_responses: {
    delegation: Delegation
    balance: DelegationBalance
  }[]
  pagination: ApiResponsePagination
}

export type GetValidatorDelegationsApiResponse = {
  code: number
  msg: GetValidatorDelegationsResponse
  error: string
}
