'use client'

import { formatEther } from 'viem'

import StakingDataCard, { StakingDataCardWithPopover } from '@/components/cards/StakingDataCard'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import useApr from '@/lib/services/hooks/useApr'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { formatLargeMetricsNumber } from '@/lib/utils'
import { useNetworkTotalStake } from '@/lib/services/hooks/useNetworkTotalStake'
import { useNetworkStakingParams } from '@/lib/services/hooks/useNetworkStakingParams'

export default function Metrics({ tokenType }: { tokenType: 'UNLOCKED' | 'LOCKED' | 'ALL' }) {
  const {
    data: allValidators,
    isFetching: isFetchingValidators,
    isError: isErrorValidators,
  } = useAllValidators({ tokenType })
  const { data: networkTotalStake, isFetching: isFetchingStake, isError: isErrorStake } = useNetworkTotalStake()
  const { data: apr, isFetching: isFetchingApr, isError: isErrorApr } = useApr()
  const {
    data: stakingParams,
    isFetching: isFetchingStakingParams,
    isError: isErrorStakingParams,
  } = useNetworkStakingParams()
  const isSmallDevice = useIsSmallDevice()

  const stakingPeriods = stakingParams?.params?.periods

  // Prepare options and dataMap for StakingDataCardWithPopover based on stakingPeriods and apr
  const aprOptions =
    stakingPeriods && apr
      ? stakingPeriods.map((period) => ({
          label:
            period.duration !== '0'
              ? `APR (${Math.floor(Number(period.duration) / 86400 / 1e9)} day lock)`
              : 'Base APR',
          value: period.period_type.toString(),
        }))
      : []

  const aprDataMap =
    stakingPeriods && apr
      ? stakingPeriods.reduce(
          (acc, period) => {
            acc[period.period_type] = (Number(apr) * Number(period.rewards_multiplier)).toFixed(2)
            return acc
          },
          {} as Record<string, string>
        )
      : {}
  // Build the lock period/multiplier list for the tooltip dynamically from API data
  const lockPeriodList =
    stakingPeriods && stakingPeriods.length > 0
      ? stakingPeriods
          .filter((period) => period.duration !== '0')
          .sort((a, b) => Number(a.duration) - Number(b.duration))
          .map((period) => {
            // duration is in nanoseconds, convert to days
            const days = Math.floor(Number(period.duration) / 86400 / 1e9)
            // Show as integer or one decimal if needed
            const multiplier =
              Number(period.rewards_multiplier) % 1 === 0
                ? Number(period.rewards_multiplier).toFixed(0)
                : Number(period.rewards_multiplier).toFixed(1)
            return (
              <li key={period.period_type}>
                {days} day lock → {multiplier}x multiplier
              </li>
            )
          })
      : null

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
          networkTotalStake
            ? formatLargeMetricsNumber(formatEther(BigInt(networkTotalStake?.totalStakeAmount), 'gwei'), {
                useSuffix: isSmallDevice,
              }) + ' IP'
            : undefined
        }
        className="grow"
        isFetching={isFetchingStake}
        isError={isErrorStake}
      />
      <StakingDataCardWithPopover
        title="APR"
        options={aprOptions}
        dataMap={aprDataMap}
        defaultValue="0"
        tooltip={
          <div className="text-sm leading-snug space-y-2 text-wrap">
            <p>
              <strong>What is APR?</strong>
              <br />
              The annual reward rate based on network inflation and total staked tokens.
            </p>

            <p>
              <strong>Increase APR by staking for longer:</strong>
            </p>
            <ul className="list-disc list-inside ml-2">
              <li>Unlock anytime (no lock) → Base APR</li>
              {lockPeriodList}
            </ul>

            <p>The multipliers stay in effect even after the lock expires.</p>
          </div>
        }
        isError={isErrorStakingParams || isErrorApr}
        isFetching={isFetchingStakingParams || isFetchingApr}
      />
    </div>
  )
}
