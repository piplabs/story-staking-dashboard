import {
  EvmOperation,
  GetAprApiResponse,
  GetAprResponse,
  GetEvmOperationsApiResponse,
  GetEvmOperationsParams,
  GetEvmOperationsResponse,
  GetNetworkHealthApiResponse,
  GetNetworkHealthResponse,
  GetStakingPoolApiResponse,
  GetStakingPoolResponse,
  GetTokenTotalSupplyApiResponse,
  GetTokenTotalSupplyParams,
  GetTokenTotalSupplyResponse,
} from '@/lib/types/networkApiTypes'

import { stakingDataAxios } from '.'

export async function getApr(): Promise<GetAprResponse> {
  const response = await stakingDataAxios.get<GetAprApiResponse>(`estimated_apr`)

  if (response.data.code == 200) {
    return response.data.msg.apr
  }
  return '-'
}

export async function getNetworkHealth(): Promise<GetNetworkHealthResponse> {
  const response = await stakingDataAxios.get<GetNetworkHealthApiResponse>(`network_status`)
  return response.data.msg
}

export async function getEvmOperations(
  params: GetEvmOperationsParams
): Promise<GetEvmOperationsResponse> {
  function parseEventMsg(operation: EvmOperation) {
    switch (operation.event_type) {
      case 'Withdraw':
        return { unstakeAmount: JSON.parse(operation.event_msg).unstakeAmount }
      case 'Deposit':
        return JSON.parse(operation.event_msg)
      case 'Redelegate':
        return { amount: JSON.parse(operation.event_msg).amount }
      default:
        return null
    }
  }

  const response = await stakingDataAxios.post<GetEvmOperationsApiResponse>(
    `/operation/evm/${params.evmAddr}`,
    {
      page: params.page,
      size: params.pageSize,
      event_type: '',
    }
  )

  if (response.status === 200) {
    const parsedOperations = response.data.msg.operations.map((operation) => ({
      ...operation,
      parsedEventMsg: parseEventMsg(operation),
    }))

    return {
      total: response.data.msg.total,
      operations: parsedOperations,
    }
  }

  return {} as GetEvmOperationsResponse
}

export async function getTokenTotalSupply(
  params: GetTokenTotalSupplyParams
): Promise<GetTokenTotalSupplyResponse> {
  const response = await stakingDataAxios.get<GetTokenTotalSupplyApiResponse>(
    `/bank/supply/by_denom`,
    {
      params,
    }
  )
  if (response.status !== 200) {
    throw new Error(`Failed to get token supply: ${response.status}`)
  }
  return response.data.msg
}

export async function getStakingPool(): Promise<GetStakingPoolResponse> {
  const response = await stakingDataAxios.get<GetStakingPoolApiResponse>('/staking/pool')
  return response.data.msg
}
