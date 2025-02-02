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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { feeEther, feeWei } from '@/lib/constants'
import { useWriteIpTokenStakeUnstake } from '@/lib/contracts'
import { useDelegatorDelegations } from '@/lib/services/hooks/useDelegatorDelegations'
import { useDelegatorPeriodDelegationsOnValidator } from '@/lib/services/hooks/useDelegatorPeriodDelegationsOnValidator'
import { useUnbondedDelegatorDelegations } from '@/lib/services/hooks/useUnbondedDelegatorDelegations'
import { useValidatorDelegatorDelegations } from '@/lib/services/hooks/useValidatorDelegatorDelegations'
import { Validator } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  })

export function UnstakeDelegationIdForm({
  validator,
  delegationId,
  onSuccess,
}: {
  validator: Validator
  delegationId: string
  onSuccess?: () => void
}) {
  const { address } = useAccount()
  const [unstakeTxHash, setUnstakeTxHash] = useState<Hex | undefined>(undefined)
  const sign = useSignMessage()
  const { writeContractAsync: unstake, isPending: isWaitingForWalletConfirmation } =
    useWriteIpTokenStakeUnstake()

  const { refetch: refetchDelegatorStake } = useValidatorDelegatorDelegations({
    validatorAddr: validator.consensus_pubkey.value.evm_address,
    delegatorAddr: address || zeroAddress,
  })
  const { data: periodDelegations, refetch: refetchDelegatorPeriodDelegations } =
    useDelegatorPeriodDelegationsOnValidator({
      validatorAddr: validator.consensus_pubkey.value.evm_address,
      delegatorAddr: address || zeroAddress,
    })
  const { refetch: refetchDelegations } = useDelegatorDelegations({
    delegatorAddr: address || zeroAddress,
  })
  const { refetch: refetchUnbondingDelegations } = useUnbondedDelegatorDelegations({
    delegatorAddr: address || zeroAddress,
  })

  const selectedDelegation = periodDelegations?.find((d) => d.period_delegation_id === delegationId)

  const formSchema = createFormSchema({
    totalStaked: selectedDelegation?.shares,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unstakeAmount: '1024',
    },
    mode: 'onChange',
    shouldUseNativeValidation: true,
  })

  const txnReceipt = useWaitForTransactionReceipt({
    hash: unstakeTxHash || '0x',
  })

  useEffect(() => {
    if (txnReceipt.isSuccess) {
      refetchDelegatorStake()
      refetchDelegatorPeriodDelegations()
      refetchDelegations()
      refetchUnbondingDelegations()
      onSuccess?.()
    }
  }, [txnReceipt.isSuccess, refetchDelegatorStake, refetchDelegatorPeriodDelegations, onSuccess])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isButtonDisabled) return

    const { unstakeAmount } = values
    const unstakeInputs: [Address, bigint, bigint, Hex] = [
      `0x${validator.consensus_pubkey.value.compressed_hex_pubkey}`,
      BigInt(delegationId),
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
      Math.round(
        parseFloat(formatEther(BigInt(parseInt(selectedDelegation.shares).toString()), 'gwei'))
      )
  let buttonText
  if (!form.formState.isValid && form.formState.isDirty) {
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
    isExceedsAllowableUnstake ||
    isWaitingForWalletConfirmation

  const isFormDisabled =
    isTxnPending || sign.isPending || txnReceipt.isSuccess || isWaitingForWalletConfirmation

  const availableToUnstake = selectedDelegation
    ? formatEther(BigInt(parseInt(selectedDelegation.shares).toString()), 'gwei')
    : '0'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
        <h2 className="text-2xl font-bold">Unstake IP</h2>

        <section className="flex flex-col">
          <p className="font-semibold">Validator</p>
          <p className="text-primary-outline">
            {validator.description.moniker || validator.consensus_pubkey.value.evm_address}
          </p>
        </section>

        <section className="flex flex-col">
          <p className="font-semibold">Delegation ID</p>
          <p className="text-primary-outline">{delegationId}</p>
        </section>

        <section className="flex flex-col">
          <p className="font-semibold">Available to unstake</p>
          <p className="text-primary-outline">{availableToUnstake} IP</p>
        </section>

        <section className="flex flex-col">
          <p className="font-semibold">Unstaking Fee</p>
          <p className="text-primary-outline">{feeEther} IP</p>
        </section>

        <FormField
          control={form.control}
          name="unstakeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold text-white">
                Amount to Unstake <span className="text-primary-outline">(Minimum 1024 IP)</span>
              </FormLabel>
              <FormControl>
                <div className="flex h-12 w-full items-center justify-between rounded-lg border-[1px] border-solid border-stakingModalOutline bg-black pr-2">
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
            txnReceipt.isSuccess
              ? 'bg-green-500 text-white opacity-100 hover:bg-green-500'
              : 'bg-primary'
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
