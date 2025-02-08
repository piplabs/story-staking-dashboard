'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Address, zeroAddress } from 'viem'
import { Hex, formatEther, parseEther } from 'viem'
import { useAccount, useBalance, useSignMessage, useWaitForTransactionReceipt } from 'wagmi'
import { z } from 'zod'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReadIpTokenStakeMinStakeAmount, useWriteIpTokenStakeStake } from '@/lib/contracts'
import { useValidatorDelegatorDelegations } from '@/lib/services/hooks/useValidatorDelegatorDelegations'
import { Validator } from '@/lib/types'
import { base64ToHex, cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

import ViewTransaction from '../buttons/ViewTransaction'
import { DialogClose } from '../ui/dialog'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { getValidator } from '@/lib/services/api/validatorApi'

export const STAKING_PERIODS = [
  { value: '0', label: 'Flexible', multiplier: '1.0x', description: 'Unstake anytime' },
  { value: '1', label: '90 Days', multiplier: '1.051x', description: 'Lock for 90 days' },
  { value: '2', label: '360 Days', multiplier: '1.16x', description: 'Lock for 360 days' },
  { value: '3', label: '540 Days', multiplier: '1.34x', description: 'Lock for 540 days' },
] as const

const createFormSchema = ({
  minStakeAmount,
  balance,
}: {
  minStakeAmount: bigint | undefined
  balance: bigint | undefined
}) =>
  z.object({
    stakeAmount: z
      .string()
      .refine(
        (value): value is string => {
          if (!minStakeAmount || !balance) return false
          const amount = parseFloat(value)
          return !isNaN(amount) && amount >= parseFloat(formatEther(minStakeAmount))
        },
        {
          message: `Must input a valid amount ${minStakeAmount ? `(minimum: ${formatEther(minStakeAmount)})` : ''}`,
        }
      )
      .refine(
        (value): value is string => {
          if (!balance) return false
          const amount = parseFloat(value)
          return amount <= parseFloat(formatEther(balance))
        },
        {
          message: 'Insufficient balance',
        }
      ),
    validator: z.string(),
    stakingPeriod: z.string({
      required_error: 'Please select a staking period',
    }),
  })

export function StakeForm(props: { validator?: Validator; isFlexible?: boolean }) {
  const { writeContractAsync: ipTokenStake, isPending: isWaitingForWalletConfirmation } =
    useWriteIpTokenStakeStake()
  const { data: minStakeAmount } = useReadIpTokenStakeMinStakeAmount()

  const [stakeTxHash, setStakeTxHash] = useState<Hex | undefined>(undefined)
  const { address } = useAccount()
  const sign = useSignMessage()
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
  })
  const { refetch: refetchDelegatorStake } = useValidatorDelegatorDelegations({
    validatorAddr: props.validator?.operator_address || zeroAddress,
    delegatorAddr: address || zeroAddress,
  })

  const txnReceipt = useWaitForTransactionReceipt({
    hash: stakeTxHash || '0x',
  })
  const formSchema = createFormSchema({ minStakeAmount, balance: balance?.value })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stakeAmount: '1024',
      validator: props.validator?.operator_address || undefined,
      stakingPeriod: '0',
    },
  })

  useEffect(() => {
    form.trigger(['stakeAmount', 'validator', 'stakingPeriod'])
  }, [form, props.validator, minStakeAmount])

  useEffect(() => {
    refetchDelegatorStake()
    refetchBalance()
  }, [txnReceipt.isSuccess])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (props.validator?.operator_address !== undefined) {
      form.setValue('validator', props.validator.operator_address)
    }
    const { stakeAmount, stakingPeriod } = values

    let cmpPubkey: Hex = '0x'
    if (props.validator) {
      cmpPubkey = `0x${base64ToHex(props.validator.consensus_pubkey.value)}`
    } else {
      const validator = await getValidator({
        validatorAddr: form.getValues('validator') as Address,
      })
      cmpPubkey = `0x${base64ToHex(validator.consensus_pubkey.value)}`
    }

    const stakeInputs: [Hex, number, Hex] = [cmpPubkey, parseInt(stakingPeriod), '0x']

    const txHash = await ipTokenStake({
      value: parseEther(stakeAmount),
      args: stakeInputs,
    })

    setStakeTxHash(txHash)
  }

  const maxButtonOnClick = () => {
    form.setValue('stakeAmount', balance ? formatEther(balance.value) : '', {
      shouldValidate: true,
    })
  }

  const isTxnPending = txnReceipt.isPending && !!stakeTxHash

  let buttonText
  if (balance && minStakeAmount && balance.value < minStakeAmount) {
    buttonText = 'Not enough IP'
  } else if (minStakeAmount && parseEther(form.watch('stakeAmount')) < minStakeAmount) {
    buttonText = `Minimum ${formatEther(minStakeAmount)} IP`
  } else if (balance && parseEther(form.watch('stakeAmount')) > balance.value) {
    buttonText = `Exceeds balance`
  } else if (sign.isPending) {
    buttonText = 'Sign message in wallet...'
  } else if (isWaitingForWalletConfirmation) {
    buttonText = 'Confirm transaction in wallet...'
  } else if (isTxnPending) {
    buttonText = 'Transaction pending...'
  } else if (txnReceipt.isSuccess) {
    buttonText = 'Staked! View your delegations'
  } else if (!form.formState.isValid) {
    if (form.getValues('stakeAmount') === '') {
      buttonText = 'Invalid amount'
    } else if (form.getValues('validator') === undefined) {
      buttonText = 'Select a validator'
    } else {
      buttonText = 'Stake IP'
    }
  } else {
    buttonText = 'Stake IP'
  }

  const isButtonDisabled =
    isTxnPending ||
    isWaitingForWalletConfirmation ||
    sign.isPending ||
    !form.formState.isValid ||
    txnReceipt.isSuccess

  const isFormDisabled =
    isTxnPending || isWaitingForWalletConfirmation || sign.isPending || txnReceipt.isSuccess

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
        <>
          <h2 className="text-2xl font-bold">Stake IP</h2>
          {props.validator && minStakeAmount && (
            <section className="flex flex-col">
              <p className="font-semibold">Minimum Stake Amount</p>
              <p className="text-primary-outline">{formatEther(minStakeAmount) + ' IP'} </p>
            </section>
          )}
          {props.validator && (
            <section className="flex flex-col">
              <p className="text font-semibold">Supported Staking Periods</p>
              <p className="text-primary-outline">
                {props.validator?.support_token_type === undefined ||
                props.validator?.support_token_type === 0
                  ? 'Flexible Only'
                  : 'All (Flexible and locked periods)'}
              </p>
            </section>
          )}
          <ValidatorSelectFormField form={form} isFormDisabled={isFormDisabled} />
          <FormField
            control={form.control}
            name="stakingPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold text-white">
                  Staking Period
                </FormLabel>
                <FormControl>
                  {props.isFlexible ? (
                    <div className="h-12 w-full rounded-lg border border-solid border-primary-border bg-black px-4 py-3 text-white opacity-50">
                      Flexible (1.0x rewards) - Unstake anytime
                    </div>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        disabled={isFormDisabled}
                        className="h-12 w-full border-primary-border bg-black"
                      >
                        <SelectValue placeholder="Select a staking period" />
                      </SelectTrigger>
                      <SelectContent className="border-primary-border bg-black">
                        {props.validator &&
                        (props.validator?.support_token_type === undefined ||
                          props.validator?.support_token_type === 0) ? (
                          <SelectItem key="0" value="0" className="text-white">
                            <div className="flex flex-row items-center gap-2">
                              <span className="font-medium">Flexible (1.0x rewards)</span>
                              <span className="text-sm text-gray-400">- Unstake anytime</span>
                            </div>
                          </SelectItem>
                        ) : (
                          STAKING_PERIODS.map((period) => (
                            <SelectItem
                              key={period.value}
                              value={period.value}
                              className="text-white"
                            >
                              <div className="flex flex-row items-center gap-2">
                                <span className="font-medium">
                                  {period.label} ({period.multiplier} rewards)
                                </span>
                                <span className="text-sm text-gray-400">
                                  - {period.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <p className="mt-1 text-sm text-gray-400">
                  Longer staking periods earn higher rewards. After the period ends, you continue
                  earning the same rate until you unstake. For more information, please visit{' '}
                  <a
                    href="https://docs.story.foundation/docs/tokenomics-staking#staking-period"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sp-purple hover:underline"
                  >
                    our documentation
                  </a>
                  .
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stakeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] text-primary-outline">
                  <span className="font-semibold text-white">Amount to Stake</span> (
                  {balance
                    ? formatLargeMetricsNumber(parseFloat(formatEther(balance.value)).toFixed(3))
                    : '-'}{' '}
                  IP available)
                </FormLabel>
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
                      <button
                        type="button"
                        className="rounded-xl bg-sp-purple px-3 py-1 text-xs text-white"
                        onClick={maxButtonOnClick}
                        disabled={isFormDisabled}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mx-auto flex flex-row items-center gap-4 justify-center w-full">
            {txnReceipt.isSuccess ? (
              <>
                <Link href={`/delegations/${address}`} className="w-full">
                  <Button className={cn('flex flex-row gap-2 bg-primary text-white w-full')}>
                    Staked! View your delegations
                  </Button>
                </Link>
                <DialogClose className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
                  Close
                </DialogClose>
              </>
            ) : (
              <Button
                type="submit"
                className={cn(
                  'flex w-full flex-row gap-2',
                  isButtonDisabled ? 'cursor-not-allowed opacity-50' : '',
                  'bg-primary'
                )}
                disabled={isButtonDisabled}
                onClick={(e) => {
                  if (isButtonDisabled) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
              >
                {(isTxnPending || isWaitingForWalletConfirmation || sign.isPending) && (
                  <LoaderCircle className="animate-spin" />
                )}
                {buttonText}
              </Button>
            )}
          </div>
        </>
      </form>
      <p className="mt-4">{txnReceipt.isSuccess && <ViewTransaction txHash={stakeTxHash} />}</p>
    </Form>
  )
}

function ValidatorSelectFormField({
  form,
  isFormDisabled,
}: {
  form: any
  isFormDisabled: boolean
}) {
  const { data: filteredValidators } = useAllValidators({ tokenType: 'UNLOCKED' })
  const isSmallDevice = useIsSmallDevice()
  return (
    <FormField
      control={form.control}
      name="validator"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="space-y-2">
              <div className="overflow-hidden border-b border-primary-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary-border relative">
                      <th className="absolute">Select a validator</th>
                      <th className="pb-2 text-left text-sm font-medium"></th>
                      <th className="pb-2 text-left text-sm font-medium text-primary-outline">
                        Total Stake
                      </th>
                      <th className="pb-2 text-left text-sm font-medium text-primary-outline">
                        Uptime
                      </th>
                      <th className="pb-2 text-left text-sm font-medium text-primary-outline">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black ">
                    {filteredValidators?.allValidators.map((validator: Validator, index: any) => {
                      const validatorName = validator.description?.moniker
                        ? validator.description.moniker
                        : isSmallDevice
                          ? truncateAddress(validator.operator_address)
                          : validator.operator_address
                      return (
                        <tr
                          key={index}
                          className="border-b border-primary-border last:border-b-0 h-12 w-full"
                        >
                          <td className="px-3 py-2">
                            <input
                              type="radio"
                              value={validator.operator_address}
                              disabled={isFormDisabled}
                              checked={field.value === validator.operator_address}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                              }}
                            />
                          </td>
                          <td className="py-2 text-sm font-medium">{validatorName}</td>
                          <td className="py-2 text-sm font-medium">
                            {formatLargeMetricsNumber(
                              formatEther(BigInt(validator.tokens), 'gwei')
                            )}{' '}
                            IP
                          </td>
                          <td className="py-2 text-sm">{validator.uptime}</td>
                          <td className="py-2 text-sm">
                            {(Number(validator.commission.commission_rates.rate) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
