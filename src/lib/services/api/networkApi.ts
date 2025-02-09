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
    return response.data.msg
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
  const response = await stakingDataAxios.get<GetEvmOperationsApiResponse>(
    `/operations/${params.evmAddr}`,
    {
      params: {
        page: params.page,
        per_page: params.pageSize,
      },
    }
  )

  if (response.data.code === 200) {
    return response.data.msg
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
