'use client'

import { formatEther } from 'viem'

import StakingDataCard from '@/components/cards/StakingDataCard'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import useApr from '@/lib/services/hooks/useApr'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { useStakingPool } from '@/lib/services/hooks/useStakingPool'
import { formatLargeMetricsNumber } from '@/lib/utils'

export default function Metrics({ tokenType }: { tokenType: 'UNLOCKED' | 'LOCKED' | 'ALL' }) {
  const {
    data: allValidators,
    isFetching: isFetchingValidators,
    isError: isErrorValidators,
  } = useAllValidators({ tokenType })
  const { data: stakingPool, isFetching: isFetchingStake, isError: isErrorStake } = useStakingPool()
  const { data: apr, isFetching: isFetchingApr, isError: isErrorApr } = useApr()

  const isSmallDevice = useIsSmallDevice()

  return (
    <div className="flex grow flex-col gap-8 lg:flex-row">
      <StakingDataCard
        title="Validators"
        data={allValidators?.allValidators?.length.toString()}
        className="grow"
        isFetching={isFetchingValidators}
        isError={isErrorValidators}
      />
      <StakingDataCard
        title="Total Staked"
        data={
          stakingPool
            ? formatLargeMetricsNumber(formatEther(BigInt(stakingPool.pool.bonded_tokens), 'gwei'), {
                useSuffix: isSmallDevice,
              }) + ' IP'
            : undefined
        }
        className="grow"
        isFetching={isFetchingStake}
        isError={isErrorStake}
      />
      <StakingDataCard
        title="APR"
        data={apr || '-'}
        tooltip={'Latest APR based on current inflation and total bonded token amount.'}
        className="grow"
        isFetching={isFetchingApr}
        isError={isErrorApr}
      />
    </div>
  )
}
