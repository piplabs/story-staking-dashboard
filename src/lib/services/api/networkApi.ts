import {
  GetAprApiResponse,
  GetAprResponse,
  GetEvmOperationsApiResponse,
  GetEvmOperationsParams,
  GetEvmOperationsResponse,
  GetNetworkHealthApiResponse,
  GetNetworkHealthResponse,
  GetNetworkStakingParamsApiResponse,
  GetNetworkStakingParamsResponse,
  GetNetworkTotalStakeApiResponse,
  GetNetworkTotalStakeResponse,
  GetNetworkTotalStakeHistoryApiResponse,
  GetNetworkTotalStakeHistoryResponse,
  GetStakingPoolApiResponse,
  GetStakingPoolResponse,
  GetTokenTotalSupplyApiResponse,
  GetTokenTotalSupplyParams,
  GetTokenTotalSupplyResponse,
  GetNetworkTotalStakeHistoryParams,
} from '@/lib/types/networkApiTypes'

import { stakingDataAxios } from '.'
import { formatEther } from 'viem'

export async function getApr(): Promise<GetAprResponse> {
  const response = await stakingDataAxios.get<GetAprApiResponse>(`estimated_apr`)

  if (response.data.code == 200) {
    let apr = response.data.msg
    if (typeof apr === 'string' && apr.includes('%')) {
      apr = apr.replace('%', '').trim()
    }
    return apr
  }
  return '-'
}

export async function getNetworkHealth(): Promise<GetNetworkHealthResponse> {
  const response = await stakingDataAxios.get<GetNetworkHealthApiResponse>(`network_status`)
  return response.data.msg
}

export async function getEvmOperations(params: GetEvmOperationsParams): Promise<GetEvmOperationsResponse> {
  const response = await stakingDataAxios.get<GetEvmOperationsApiResponse>(`/operations/${params.evmAddr}`, {
    params: {
      page: params.page,
      per_page: params.pageSize,
    },
  })

  if (response.data.code === 200) {
    return response.data.msg
  }

  return {} as GetEvmOperationsResponse
}

export async function getTokenTotalSupply(params: GetTokenTotalSupplyParams): Promise<GetTokenTotalSupplyResponse> {
  const response = await stakingDataAxios.get<GetTokenTotalSupplyApiResponse>(`/bank/supply/by_denom`, {
    params,
  })
  if (response.status !== 200) {
    throw new Error(`Failed to get token supply: ${response.status}`)
  }
  return response.data.msg
}

export async function getStakingPool(): Promise<GetStakingPoolResponse> {
  const response = await stakingDataAxios.get<GetStakingPoolApiResponse>('/staking/pool')

  const totalStaked = BigInt(response.data.msg.pool.bonded_tokens) + BigInt(response.data.msg.pool.not_bonded_tokens)
  return {
    ...response.data.msg,
    totalStaked: totalStaked.toString(),
  }
}

export async function getNetworkStakingParams(): Promise<GetNetworkStakingParamsResponse> {
  const response = await stakingDataAxios.get<GetNetworkStakingParamsApiResponse>('/staking/params')
  if (response.status !== 200) {
    throw new Error(`Failed to get network staking params: ${response.status}`)
  }
  const msg = response.data.msg

  return {
    ...msg,
    params: {
      ...msg.params,
      minDelegationEth: formatEther(BigInt(msg.params.min_delegation), 'gwei'),
    },
  }
}

export async function getNetworkTotalStakeHistory(
  params?: GetNetworkTotalStakeHistoryParams
): Promise<GetNetworkTotalStakeHistoryResponse> {
  const response = await stakingDataAxios.get<GetNetworkTotalStakeHistoryApiResponse>(
    '/staking/total_stake_token/history',
    {
      params: {
        interval: params?.interval || '1d',
        ...params,
      },
    }
  )

  if (response.status !== 200) {
    throw new Error(`Failed to get network total stake history: ${response.status}`)
  }

  return {
    totalStakeAmountHistory: response.data.msg.total_stake_amount_history,
  }
}

export async function getNetworkTotalStake(): Promise<GetNetworkTotalStakeResponse> {
  const response = await stakingDataAxios.get<GetNetworkTotalStakeApiResponse>('/staking/total_stake_token')

  if (response.status !== 200) {
    throw new Error(`Failed to get network total stake: ${response.status}`)
  }

  return {
    totalStakeAmount: response.data.msg.total_stake_amount,
    lastUpdateTime: response.data.msg.last_update_time,
  }
}
