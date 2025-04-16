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
  tx_hash: Hex
  block_height: number
  event_type:
    | 'CreateValidator'
    | 'Deposit'
    | 'UpdateValidatorCommission'
    | 'SetWithdrawalAddress'
    | 'SetRewardAddress'
    | 'Redelegate'
    | 'Withdraw'
    | 'Unjail'
  address: Address
  src_validator_address: Address
  dst_validator_address: Address
  dst_address: Address
  status_ok: boolean
  error_code: string
  amount: string
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
  totalStaked: string
}

export type GetStakingPoolApiResponse = {
  code: number
  msg: GetStakingPoolResponse
  error: string
}

export type GetNetworkStakingParamsResponse = {
  params: {
    unbonding_time: string
    max_validators: number
    max_entries: number
    historical_entries: number
    bond_denom: string
    min_commision_rate: string
    min_delegation: string
    periods: { period_type: number; duration: string; rewards_multiplier: string }[]
    token_types: { token_type: number; rewards_multiplier: string }[]
    singularity_height: string
    minDelegationEth: string
  }
}
export type GetNetworkStakingParamsApiResponse = {
  code: number
  error: string
  msg: GetNetworkStakingParamsResponse
}

export type TotalStakeHistoryItem = {
  total_stake_amount: string
  update_at: string
}

export type GetNetworkTotalStakeHistoryParams = {
  interval?: '1d' | '7d' | '30d' | 'all'
}

export type GetNetworkTotalStakeHistoryApiResponse = {
  code: number
  msg: {
    total_stake_amount_history: TotalStakeHistoryItem[]
  }
  error: string
}

export type GetNetworkTotalStakeHistoryResponse = {
  totalStakeAmountHistory: TotalStakeHistoryItem[]
}

export interface GetNetworkTotalStakeApiResponse {
  code: number
  msg: {
    total_stake_amount: string
    last_update_time: string
  }
  error: string
}

export interface GetNetworkTotalStakeResponse {
  totalStakeAmount: string
  lastUpdateTime: string
}
