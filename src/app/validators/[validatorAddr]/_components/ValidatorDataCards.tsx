'use client'

import { InfoCircledIcon } from '@radix-ui/react-icons'
import { formatEther, getAddress } from 'viem'

import CopyStringButton from '@/components/buttons/CopyStringButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { useStakingPool } from '@/lib/services/hooks/useStakingPool'
import { useValidatorDelegations } from '@/lib/services/hooks/useValidatorDelegations'
import { useValidatorDelegatorDelegations } from '@/lib/services/hooks/useValidatorDelegatorDelegations'
import { Validator } from '@/lib/types'
import { base64ToHex, formatLargeMetricsNumber, formatPercentage, truncateAddress } from '@/lib/utils'
import StyledCard from '@/components/cards/StyledCard'
import TooltipWrapper from '@/components/TooltipWrapper'

export function AddressesCard({ validator }: { validator: Validator }) {
  return (
    <StyledCard className="w-full">
      <h1>Addresses</h1>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Moniker"
          value={validator.description.moniker}
          tooltipInfo="The preferred name of the validator node operator"
          isValueAddress={true}
        />
        <DataRow
          title="EVM Address"
          value={getAddress(validator.operator_address)}
          tooltipInfo="EVM Address of the validator"
          isValueAddress={true}
        />
        <DataRow
          title="Compressed Pubkey (hex)"
          value={validator.consensus_pubkey.value ? `0x${base64ToHex(validator.consensus_pubkey.value)}` : '-'}
          tooltipInfo="The validator's compressed public key in hex format"
          isTextTruncated={true}
          isValueAddress={true}
        />
      </section>
    </StyledCard>
  )
}

export function StakeInfoCard({ validator }: { validator: Validator }) {
  const totalStakedIp = formatEther(BigInt(Math.floor(parseFloat(validator.tokens))), 'gwei')
  const { data: selfStake } = useValidatorDelegatorDelegations({
    validatorAddr: validator.operator_address,
    delegatorAddr: validator.operator_address,
  })
  const delegatedStakeAmount = selfStake
    ? formatLargeMetricsNumber(
        formatEther(
          BigInt(Math.floor(parseFloat(validator.tokens))) -
            BigInt(Math.floor(parseFloat(selfStake.delegation_response.balance.amount))),
          'gwei'
        )
      )
    : undefined

  const selfStakeAmount = selfStake
    ? formatLargeMetricsNumber(
        formatEther(BigInt(Math.floor(parseFloat(selfStake.delegation_response.balance.amount))), 'gwei')
      )
    : undefined

  return (
    <StyledCard className="w-full">
      <p className="font-archivo text-3xl font-medium">Stake Info</p>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Total Stake"
          value={formatLargeMetricsNumber(totalStakedIp) + ' IP'}
          tooltipInfo="Total stake is the sum of the validator's self-staked tokens and the tokens delegated to the validator by other stakers"
        />

        <DataRow
          title="Delegated Stake"
          value={delegatedStakeAmount ? `${delegatedStakeAmount} IP` : '-'}
          tooltipInfo="The total amount of tokens delegated to the validator by other users"
        />
        <DataRow
          title="Self-Staked"
          value={selfStakeAmount ? `${selfStakeAmount} IP` : '-'}
          tooltipInfo="The tokens that the validator has staked on themselves."
        />
      </section>
    </StyledCard>
  )
}

export function DataRow({
  title,
  value,
  tooltipInfo,
  isTextTruncated = true,
  isValueAddress,
}: {
  title: string
  value: string | number
  tooltipInfo?: string
  isTextTruncated?: boolean
  isValueAddress?: boolean
}) {
  const isSmallDevice = useIsSmallDevice()
  return (
    <div className="flex flex-row justify-between text-sm lg:text-base">
      <div className="flex items-center">
        <span>{title}</span>
        {tooltipInfo && (
          <span className="my-auto ml-2 flex">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon />
                </TooltipTrigger>
                <TooltipContent className="max-w-64 bg-gray-900 text-gray-50 border-gray-700 text-xs leading-4 tracking-[0.48px]">
                  <p>{tooltipInfo}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        )}
      </div>
      <div className="my-auto flex flex-row justify-end">
        <p className="ml-2 mr-2">
          {typeof value === 'string' && ((isValueAddress && value.length > 42) || isSmallDevice)
            ? truncateAddress(value, 15, 10)
            : value}
        </p>
        {isValueAddress && <CopyStringButton value={value as string} />}
      </div>
    </div>
  )
}

export function OverviewCard({ validator }: { validator: Validator }) {
  const { data: delegatorDelegations } = useValidatorDelegations({
    validatorAddr: validator.operator_address,
  })
  const { data: bondedTokensGwei } = useStakingPool()
  const totalStakedIp = formatEther(BigInt(Math.floor(Number(validator.tokens) * 1e9)), 'wei')

  const bondedTokens = formatEther(BigInt(bondedTokensGwei?.pool.bonded_tokens || 1e9), 'gwei')

  const votingPower = (Number(totalStakedIp) / Number(bondedTokens)) * 100

  return (
    <StyledCard className="w-full">
      <p className="font-archivo text-3xl font-medium">Overview</p>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Voting Power"
          value={formatPercentage(votingPower.toString()) || '-'}
          tooltipInfo="The voting power of this validator"
        />

        <DataRow
          title="Number of Delegators"
          value={delegatorDelegations?.pagination?.total || '-'}
          tooltipInfo="Number of delegators that have delegated their stake on this validator"
        />
        <DataRow
          title="Supported Token Type"
          value={
            validator.support_token_type === undefined || validator.support_token_type === 0 ? 'Locked' : 'Unlocked'
          }
          tooltipInfo="Whether this validator accepts unlocked or locked tokens for staking."
        />
        <DataRow
          title="Uptime"
          value={validator.uptime}
          tooltipInfo="The percentage of time the validator has been online and actively participating in consensus"
        />
      </section>
    </StyledCard>
  )
}

export function CommissionCard({ validator }: { validator: Validator }) {
  const commission = validator.commission

  return (
    <StyledCard className="w-full">
      <p className="font-archivo text-3xl font-medium">Commission</p>
      <div className="border-grey mb-2 mt-2 border-b" />
      <section className="flex flex-col gap-2">
        <DataRow
          title="Commission Rate"
          value={`${parseFloat((Number(formatLargeMetricsNumber(commission.commission_rates.rate)) * 100).toFixed(2))}%`}
          tooltipInfo="Commission is the percentage a validator receives from the rewards earned by their delegators"
        />
        <DataRow
          title="Max Rate"
          value={`${parseFloat((Number(formatLargeMetricsNumber(commission.commission_rates.max_rate)) * 100).toFixed(2))}%`}
          tooltipInfo="The maximum commission rate which this validator can ever charge"
        />

        <DataRow
          title="Max Daily Change Rate"
          value={`${parseFloat((Number(formatLargeMetricsNumber(commission.commission_rates.max_change_rate)) * 100).toFixed(2))}%`}
          tooltipInfo="The maximum daily increase of the validator commission"
        />
      </section>
    </StyledCard>
  )
}
