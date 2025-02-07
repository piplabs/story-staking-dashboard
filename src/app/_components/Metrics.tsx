'use client'

import { formatEther } from 'viem'

import StakingDataCard from '@/components/cards/StakingDataCard'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import useApr from '@/lib/services/hooks/useApr'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { useStakingPool } from '@/lib/services/hooks/useStakingPool'
import { formatLargeMetricsNumber } from '@/lib/utils'

export default function Metrics() {
  const {
    data: allValidators,
    isFetching: isFetchingValidators,
    isError: isErrorValidators,
  } = useAllValidators({})

  const {
    data: stsakingPool,
    isFetching: isFetchingStake,
    isError: isErrorStake,
  } = useStakingPool()
  const { data: apr, isFetching: isFetchingApr, isError: isErrorApr } = useApr()

  const isSmallDevice = useIsSmallDevice()

  return (
    <div className="flex grow flex-col gap-8 lg:flex-row">
      <StakingDataCard
        title="Validators"
        data={allValidators?.pagination?.total}
        className="grow"
        isFetching={isFetchingValidators}
        isError={isErrorValidators}
      />
      <StakingDataCard
        title="Total Staked"
        data={
          stsakingPool
            ? formatLargeMetricsNumber(
                formatEther(BigInt(stsakingPool.pool.bonded_tokens), 'gwei'),
                {
                  useSuffix: isSmallDevice,
                }
              ) + ' IP'
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
