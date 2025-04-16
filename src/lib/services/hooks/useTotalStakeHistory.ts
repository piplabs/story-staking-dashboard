import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { getNetworkTotalStakeHistory } from '../api/networkApi'
import { GetNetworkTotalStakeHistoryParams, TotalStakeHistoryItem } from '@/lib/types/networkApiTypes'

interface FormattedStakeHistoryDataPoint {
  date: Date
  value: number
}

export function useTotalStakeHistory(params?: GetNetworkTotalStakeHistoryParams) {
  return useQuery<FormattedStakeHistoryDataPoint[], Error>({
    queryKey: ['totalStakeHistory', params?.interval],
    queryFn: async () => {
      const data = await getNetworkTotalStakeHistory(params)
      console.log(data.totalStakeAmountHistory)

      return data.totalStakeAmountHistory.map((item: TotalStakeHistoryItem) => ({
        date: new Date(Number(item.update_at) * 1000),
        blockTimestamp: item.update_at,
        value: Number(formatEther(BigInt(item.total_stake_amount), 'gwei')),
      }))
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
