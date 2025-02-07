'use client'

import { formatEther, zeroAddress } from 'viem'
import { useAccount, useBalance } from 'wagmi'

import TooltipWrapper from '@/components/TooltipWrapper'
import { StakeDialog } from '@/components/dialogs/StakeDialog'
import { UnstakeDialog } from '@/components/dialogs/UnstakeDialog'
import { useValidatorDelegatorDelegations } from '@/lib/services/hooks/useValidatorDelegatorDelegations'
import { Validator } from '@/lib/types'
import { formatLargeMetricsNumber } from '@/lib/utils'

export function YourStakeCard(props: { validator: Validator }) {
  const { address } = useAccount()
  const { data: balance, error } = useBalance({
    address: address,
    query: {
      structuralSharing: false,
    },
  })

  const { data: stakedAmountResponse, refetch } = useValidatorDelegatorDelegations({
    validatorAddr: props.validator.operator_address,
    delegatorAddr: address || zeroAddress,
  })

  const stakedAmount = stakedAmountResponse?.delegation_response.balance.amount
    ? formatLargeMetricsNumber(
        parseFloat(
          formatEther(BigInt(stakedAmountResponse.delegation_response.balance.amount), 'gwei')
        ),
        { useSuffix: false }
      )
    : '0'

  const isUnstakeDisabled = stakedAmount === '0'
  const isLockedTokenOnly = props.validator.support_token_type === 0

  return (
    <div className="flex w-full flex-col grow rounded-[16px] bg-primary-surface px-8 py-6 border border-primary-border">
      <h1>Stake </h1>
      <div className="border-grey mb-2 mt-2 border-b" />

      <div className="flex grow flex-col gap-6">
        <div className="flex flex-row">
          <div className="flex w-full flex-col gap-2">
            <p className="font-medium text-primary-outline">
              Available to Stake {isLockedTokenOnly && '(Locked tokens)'}
            </p>
            <p className="text-xl font-medium text-white md:text-4xl">
              {balance && !isLockedTokenOnly
                ? formatLargeMetricsNumber(parseFloat(formatEther(balance.value)), {
                    useSuffix: false,
                  }) + ' IP'
                : '0 IP'}
            </p>
          </div>
          <div className="my-auto">
            <StakeDialog validator={props.validator} />
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex w-full flex-col gap-2">
            <p className="font-medium text-primary-outline">Your Staked Amount</p>
            <p className="text-xl font-medium text-white md:text-4xl">{`${stakedAmount} IP`}</p>
          </div>
          <div className="my-auto">
            <UnstakeDialog validator={props.validator} isUnstakeDisabled={isUnstakeDisabled} />
          </div>
        </div>
      </div>
    </div>
  )
}
