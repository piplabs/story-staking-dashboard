import { Address, Hex } from 'viem'

export type GetAprApiResponse = {
  code: number
  msg: string
  error: string
}

export type GetAprResponse = string

export type GetNetworkHealthApiResponse = {
  code: number
  msg: GetNetworkHealthResponse
  error: string
}

export type GetNetworkHealthResponse = {
  consensus_block_height: number
  execution_block_height: number
  status: 'Normal' | 'Pending' | 'Degraded' | 'Down'
}

export type EvmOperation = {
  error_code: string
  event_msg: string
  event_type:
    | 'CreateValidator'
    | 'Deposit'
    | 'UpdateValidatorCommission'
    | 'SetWithdrawalAddress'
    | 'SetRewardAddress'
    | 'Redelegate'
    | 'Withdraw'
    | 'Unjail'
  height: number
  status: string
  target_delegator: string
  target_validator: string
  tx_hash: Hex
  parsedEventMsg: any
}

export type GetEvmOperationsResponse = {
  operations: EvmOperation[]
  total: number
}

export type GetEvmOperationsApiResponse = {
  code: number
  error: string
  msg: GetEvmOperationsResponse
}

export type GetEvmOperationsParams = {
  evmAddr: Address
  page: number
  pageSize: number
}

/* Get token total supply */
export type GetTokenTotalSupplyParams = { denom: string }

export type GetTokenTotalSupplyResponse = {
  amount: {
    denom: string
    amount: string
  }
}

export type GetTokenTotalSupplyApiResponse = {
  code: number
  msg: GetTokenTotalSupplyResponse
  error: string
}

/* Get staking pool */
export type GetStakingPoolResponse = {
  pool: {
    not_bonded_tokens: string
    bonded_tokens: string
  }
}

export type GetStakingPoolApiResponse = {
  code: number
  msg: GetStakingPoolResponse
  error: string
}
