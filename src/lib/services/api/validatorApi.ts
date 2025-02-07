import { Address } from 'viem'

import { stakingDataAxios } from '@/lib/services/api'
import { Validator } from '@/lib/types'
import {
  AllValidators,
  GetAllValidatorsApiResponse,
  GetAllValidatorsParams,
  GetValidatorApiResponse,
  GetValidatorDelegationsApiResponse,
  GetValidatorDelegationsParams,
  GetValidatorDelegationsResponse,
  GetValidatorParams,
} from '@/lib/types/validatorApiTypes'

/* Validator API queries
	1. Get all validators (/staking/validators)
	2. Get validator  `/staking/validators/${validatorAddr}`
	3. Get validator's delegators 
*/

export async function getAllValidators(params?: GetAllValidatorsParams): Promise<AllValidators> {
  const response = await stakingDataAxios.get<GetAllValidatorsApiResponse>('/staking/validators', {
    params: {
      status: params?.status || 'BOND_STATUS_BONDED',
      'pagination.limit': 500,
      'pagination.count_total': true,
    },
  })
  let validators = response.data.msg.validators

  // Apply token type filter
  if (params?.tokenType === 'LOCKED') {
    validators = validators.filter(
      (validator) =>
        validator.support_token_type === undefined || validator.support_token_type === 0
    )
  } else if (params?.tokenType === 'UNLOCKED') {
    validators = validators.filter(
      (validator) =>
        validator.support_token_type !== undefined && validator.support_token_type !== 0
    )
  }

  // Sort validators
  if (params?.sortDescending) {
    validators = validators.sort((a, b) => parseFloat(b.tokens) - parseFloat(a.tokens))
  }

  // Sort by supported token type if specified
  if (params?.sortSupportedToken) {
    validators = validators.sort((a, b) => {
      // Sort "Unlocked" (support_token_type !== 0) first
      const aIsUnlocked = a.support_token_type !== undefined && a.support_token_type !== 0
      const bIsUnlocked = b.support_token_type !== undefined && b.support_token_type !== 0
      return bIsUnlocked ? 1 : aIsUnlocked ? -1 : 0
    })
  }

  return {
    allValidators: validators,
    pagination: response.data.msg.pagination,
  }
}

export async function getValidator(params: GetValidatorParams): Promise<Validator> {
  const response = await stakingDataAxios.get<GetValidatorApiResponse>(
    `/staking/validators/${params.validatorAddr}`
  )
  if (response.data.code !== 200) {
    throw new Error(response.data.error || 'Failed to fetch validator')
  }

  return response.data.msg
}

export async function getValidatorDelegations(
  params: GetValidatorDelegationsParams
): Promise<GetValidatorDelegationsResponse | undefined> {
  if (!params.validatorAddr) return undefined

  const response = await stakingDataAxios.get<GetValidatorDelegationsApiResponse>(
    `/staking/validators/${params.validatorAddr}/delegations`,
    {
      params: {
        'pagination.limit': 100000,
        'pagination.count_total': true,
      },
    }
  )

  if (response.data.code !== 200) {
    if (response.data.code == 500) {
      return {
        delegation_responses: [],
        pagination: null,
      }
    }
    throw new Error(response.data.error || 'Failed to fetch validator delegators')
  }

  let delegations = response.data.msg.delegation_responses

  if (!params.sortDescending) {
    delegations = delegations.sort((a, b) => {
      try {
        const aStaked = BigInt(a.balance.amount)
        const bStaked = BigInt(b.balance.amount)
        return aStaked > bStaked ? -1 : aStaked < bStaked ? 1 : 0
      } catch (error) {
        throw new Error('Invalid balance amount format in delegation response')
      }
    })
  }

  const validatorDelegations = {
    delegation_responses: delegations,
    pagination: response.data.msg.pagination,
  }

  return validatorDelegations
}
