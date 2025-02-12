'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Address, formatEther, parseEther } from 'viem'
import { Hex, zeroAddress } from 'viem'
import { useAccount, useSignMessage, useWaitForTransactionReceipt } from 'wagmi'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { feeEther, feeWei, STAKING_PERIODS } from '@/lib/constants'
import { useWriteIpTokenStakeUnstake } from '@/lib/contracts'
import { useDelegatorPeriodDelegationsOnValidator } from '@/lib/services/hooks/useDelegatorPeriodDelegationsOnValidator'
import { useValidatorDelegatorDelegations } from '@/lib/services/hooks/useValidatorDelegatorDelegations'
import { StakingPeriodMultiplierInfo, Validator } from '@/lib/types'
import { base64ToHex, cn, formatLargeMetricsNumber } from '@/lib/utils'

import ViewTransaction from '../buttons/ViewTransaction'

const createFormSchema = ({ totalStaked }: { totalStaked?: string }) =>
  z.object({
    unstakeAmount: z.string().refine(
      (value): value is string => {
        if (!totalStaked) return false
        const amount = parseFloat(value)
        return !isNaN(amount) && amount >= 1024 && amount <= parseFloat(totalStaked)
      },
      {
        message: `Must input a valid amount (minimum: 1024 IP)`,
      }
    ),
    periodDelegationId: z.string(),
  })

export function UnstakeForm({ validator }: { validator: Validator }) {
  const { address } = useAccount()
  const [unstakeTxHash, setUnstakeTxHash] = useState<Hex | undefined>(undefined)
  const sign = useSignMessage()
  const { writeContractAsync: unstake, isPending: isWaitingForWalletConfirmation } = useWriteIpTokenStakeUnstake()

  const { data: stakedAmount, refetch: refetchDelegatorStake } = useValidatorDelegatorDelegations({
    validatorAddr: validator.operator_address,
    delegatorAddr: address || zeroAddress,
  })
  const { data: periodDelegations, refetch: refetchDelegatorPeriodDelegations } =
    useDelegatorPeriodDelegationsOnValidator({
      validatorAddr: validator.operator_address,
      delegatorAddr: address || zeroAddress,
    })

  const formSchema = createFormSchema({
    totalStaked: stakedAmount?.delegation_response.balance.amount,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unstakeAmount: '',
      periodDelegationId: '',
    },
  })

  const selectedPeriodId = form.getValues('periodDelegationId')

  const selectedDelegation = periodDelegations?.period_delegation_responses.find(
    (d) => d.period_delegation.period_delegation_id === selectedPeriodId.toString()
  )

  const txnReceipt = useWaitForTransactionReceipt({
    hash: unstakeTxHash || '0x',
  })

  useEffect(() => {
    refetchDelegatorStake()
    refetchDelegatorPeriodDelegations()
  }, [txnReceipt.isSuccess, refetchDelegatorStake, refetchDelegatorPeriodDelegations])

  useEffect(() => {
    refetchDelegatorPeriodDelegations()
  }, [validator, address])

  const maxButtonOnClick = () => {
    const selectedPeriodId = form.getValues('periodDelegationId')
    const selectedDelegation = periodDelegations?.period_delegation_responses.find(
      (d) => d.period_delegation.period_delegation_id === selectedPeriodId
    )

    if (selectedDelegation) {
      form.setValue('unstakeAmount', selectedDelegation.period_delegation.shares, {
        shouldValidate: true,
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isButtonDisabled) return

    const { unstakeAmount, periodDelegationId } = values

    const unstakeInputs: [Address, bigint, bigint, Hex] = [
      `0x${base64ToHex(validator.consensus_pubkey.value)}`,
      BigInt(periodDelegationId),
      parseEther(unstakeAmount),
      '0x',
    ]

    try {
      const tx = await unstake({
        args: unstakeInputs,
        value: feeWei,
      })
      setUnstakeTxHash(tx)
    } catch (e) {
      console.error('Error unstaking:', e)
    }
  }

  const isTxnPending = txnReceipt.isPending && !!unstakeTxHash
  const isExceedsAllowableUnstake =
    selectedDelegation &&
    parseInt(form.watch('unstakeAmount')) >
      parseInt(formatEther(BigInt(parseInt(selectedDelegation.period_delegation.shares).toString()), 'gwei'))

  let buttonText
  if (!selectedPeriodId) {
    buttonText = 'Select a stake'
  } else if (!form.formState.isValid) {
    buttonText = 'Invalid amount'
  } else if (isExceedsAllowableUnstake) {
    buttonText = 'Exceeds allowable amount'
  } else if (sign.isPending) {
    buttonText = 'Sign message in wallet...'
  } else if (isWaitingForWalletConfirmation) {
    buttonText = 'Confirm transaction in wallet...'
  } else if (isTxnPending) {
    buttonText = 'Unstaking...'
  } else if (txnReceipt.isSuccess) {
    buttonText = 'Unstaked!'
  } else {
    buttonText = 'Unstake IP'
  }
  const isButtonDisabled =
    isTxnPending ||
    sign.isPending ||
    !form.formState.isValid ||
    txnReceipt.isSuccess ||
    !selectedPeriodId ||
    isExceedsAllowableUnstake ||
    isWaitingForWalletConfirmation

  const isFormDisabled = isTxnPending || sign.isPending || txnReceipt.isSuccess || isWaitingForWalletConfirmation

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
        <h2 className="text-2xl font-bold">Unstake IP</h2>
        <section className="flex flex-col">
          <p className="font-semibold">Validator</p>
          <p className="text-primary-outline">{validator.description.moniker || validator.operator_address}</p>
        </section>

        <section className="flex flex-col">
          <p className="font-semibold">Unstaking Fee</p>
          <p className="text-primary-outline">{feeEther} IP</p>
        </section>
        {periodDelegations?.period_delegation_responses.length ? (
          <section className="flex flex-col gap-2">
            <p className="font-semibold">Select From Your Stake</p>
            <div className="max-h-80 overflow-y-auto rounded-lg border border-primary-border bg-black p-4">
              <FormField
                control={form.control}
                name="periodDelegationId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-primary-border">
                              <th className="pb-2 text-center"></th>
                              <th className="pb-2 text-center text-sm font-medium">Staked Amount</th>
                              <th className="pb-2 text-center text-sm font-medium">Staking Period Type</th>
                              <th className="pb-2 text-center text-sm font-medium">Unstakable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {periodDelegations?.period_delegation_responses.map((delegation: any, index: any) => {
                              const isUnlocked = new Date(delegation.period_delegation.end_time) <= new Date()
                              const stakingPeriod = STAKING_PERIODS[process.env.NEXT_PUBLIC_CHAIN_ID].find(
                                (period: StakingPeriodMultiplierInfo) =>
                                  period.value === (delegation.period_delegation.period_type?.toString() ?? '0')
                              )

                              const unstakeAvailable =
                                (Number(stakedAmount?.delegation_response.balance.amount || 0) *
                                  Number(delegation?.period_delegation.shares || 0)) /
                                Number(stakedAmount?.delegation_response.balance.amount || 1)
                              return (
                                <tr key={index} className="border-b border-primary-border text-center last:border-b-0">
                                  <td className="py-2">
                                    <input
                                      type="radio"
                                      value={delegation.period_delegation.period_delegation_id}
                                      checked={field.value === delegation.period_delegation.period_delegation_id}
                                      disabled={!isUnlocked || isFormDisabled}
                                      onChange={(e) => {
                                        field.onChange(e.target.value)
                                        form.setValue('unstakeAmount', '', {
                                          shouldValidate: true,
                                        })
                                      }}
                                    />
                                  </td>
                                  <td className="py-2 text-sm font-medium">
                                    {formatLargeMetricsNumber(
                                      parseFloat(formatEther(BigInt(Math.floor(unstakeAvailable)), 'gwei')),
                                      { useSuffix: false }
                                    )}{' '}
                                    IP
                                  </td>
                                  <td className="py-2 text-sm text-primary-outline">
                                    {stakingPeriod
                                      ? `${stakingPeriod.label} (${stakingPeriod.multiplier} rewards)`
                                      : ''}
                                  </td>
                                  <td className="py-2 text-sm text-primary-outline">
                                    {isUnlocked
                                      ? 'Unstakable Now'
                                      : `Unstakable on ${new Date(delegation.period_delegation.end_time).toLocaleString('en-US', { timeZone: 'UTC' })} UTC`}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        ) : null}

        <FormField
          control={form.control}
          name="unstakeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold text-white">Amount to Unstake</FormLabel>
              <FormControl>
                <div className="flex h-12 w-full items-center justify-between rounded-lg border-[1px] border-solid border-primary-border bg-black pr-2">
                  <Input
                    disabled={isFormDisabled}
                    className="border-none bg-black font-normal text-white placeholder-gray-500 outline-none placeholder:text-white placeholder:opacity-50 focus:border-0 focus:border-none focus:outline-none focus:ring-0 focus:ring-transparent"
                    placeholder="Enter amount..."
                    {...field}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="ml-2 text-white text-opacity-50">IP</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn(
            'flex w-full flex-row gap-2 font-semibold',
            isButtonDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
            txnReceipt.isSuccess ? 'bg-green-500 text-white opacity-100 hover:bg-green-500' : 'bg-primary'
          )}
          disabled={isButtonDisabled}
        >
          {(isTxnPending || sign.isPending) && <LoaderCircle className="animate-spin" />}
          {buttonText}
        </Button>
      </form>
      {txnReceipt.isSuccess && <ViewTransaction txHash={unstakeTxHash} />}
    </Form>
  )
}
