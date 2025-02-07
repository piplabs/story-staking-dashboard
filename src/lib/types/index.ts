import { Address } from 'viem'

export type ApiResponsePagination = {
  total: string
  next_key: string
} | null

export type ValidatorRequest = {
  blockHeight: string
  validators: {
    id: string
    address: string
    pub_key: {
      type: string
      value: string
    }
    voting_power: string
    proposer_priority: string
  }[]
  count: number
  total: number
}

export type IpAsset = {
  name: string
  ipId: Address
  imageUrl?: string
  nftAddress?: Address
  tokenId?: string
}

export type Validator = {
  operator_address: Address
  consensus_pubkey: {
    type: string
    value: string
  }
  status: number
  support_token_type: 0 | 1
  tokens: string
  jailed: boolean
  delegator_shares: string
  description: {
    moniker: string
  }
  commission: {
    commission_rates: {
      rate: string
      max_rate: string
      max_change_rate: string
    }
    update_time: string
  }
  uptime: string
}
export type DelegatorDelegationAndBalance = {
  delegation_response: {
    delegation: Delegation
    balance: DelegationBalance
  }
}

export type Delegation = {
  delegator_address: Address
  validator_address: Address
  shares: string
}

export type DelegationBalance = {
  denom: string
  amount: string
}

export type StakingPool = {
  not_bonded_tokens: string
  bonded_tokens: string
}

export type Delegator = {
  delegation: Delegation
  balance: DelegationBalance
  evmAddress: Address
}

// export type DelegatorDelegation = {
//   delegator_address: {
//     compressed_base64_pubkey: 'string'
//     compressed_hex_pubkey: 'string'
//     delegator_address: 'string'
//     evm_address: 'string'
//     uncompressed_hex_pubkey: 'string'
//   }
//   rewards_shares: 'string'
//   shares: 'string'
//   validator_address: 'string'
// }

export type ValidatorDelegations = {
  validatorAddr: string
  delegations: {
    delegation: Delegation
    balance: DelegationBalance
    periodDelegations?: any // Type from period delegations response
  }[]
}

export type PeriodDelegation = {
  delegator_address: Address
  validator_address: Address
  end_time: string
  period_delegation_id: string
  rewards_shares: string
  shares: string
  period_type?: number
}
