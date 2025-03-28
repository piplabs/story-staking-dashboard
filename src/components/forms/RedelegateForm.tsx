'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Address, zeroAddress } from 'viem'
import { Hex, parseEther } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { feeEther, feeWei } from '@/lib/constants'
import { useWriteIpTokenStakeRedelegate } from '@/lib/contracts'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import { useDelegatorDelegations } from '@/lib/services/hooks/useDelegatorDelegations'
import { useDelegatorPeriodDelegationsOnValidator } from '@/lib/services/hooks/useDelegatorPeriodDelegationsOnValidator'
import { Validator } from '@/lib/types'
import { base64ToHex, cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

import ViewTransaction from '../buttons/ViewTransaction'
import { getValidator } from '@/lib/services/api/validatorApi'
import { useDelegatorPeriodDelegations } from '@/lib/services/hooks/useDelegatorPeriodDelegations'

const createFormSchema = ({ delegatedAmount }: { delegatedAmount: string | undefined }) =>
  z.object({
    redelegateAmount: z
      .string()
      .refine(
        (value): value is string => {
          if (!delegatedAmount) return false
          const amount = parseFloat(value)
          return !isNaN(amount) && amount >= 1024
        },
        {
          message: 'Must input a valid amount greater than or equal to 1024 IP',
        }
      )
      .refine(
        (value): value is string => {
          if (!delegatedAmount) return false
          const amount = parseFloat(value)
          return amount <= parseFloat(delegatedAmount)
        },
        {
          message: 'Amount exceeds delegated amount',
        }
      ),
    sourceValidator: z.string(),
    destinationValidator: z.string().min(1, {
      message: 'Please select a destination validator to redelegate to',
    }),
    delegationId: z.string().min(1, {
      message: 'Delegation ID is required',
    }),
  })

export function RedelegateForm(props: { validator: Validator; delegationId?: string; delegatedAmount?: string }) {
  const { writeContractAsync: ipTokenRedelegate, isPending: isWaitingForWalletConfirmation } =
    useWriteIpTokenStakeRedelegate()

  const [stakeTxHash, setStakeTxHash] = useState<Hex | undefined>(undefined)
  const [delegationsUpdated, setDelegationsUpdated] = useState(false)

  const { address } = useAccount()

  const { refetch: refetchDelegatorPeriodDelegationsOnValidator } = useDelegatorPeriodDelegationsOnValidator({
    validatorAddr: props.validator.operator_address,
    delegatorAddr: address || zeroAddress,
  })
  const { refetch: refetchDelegations } = useDelegatorDelegations({
    delegatorAddr: address || zeroAddress,
  })
  const { refetch: refetchDelegatorPeriodDelegations } = useDelegatorPeriodDelegations({
    delegatorAddr: address || zeroAddress,
  })

  const txnReceipt = useWaitForTransactionReceipt({
    hash: stakeTxHash || '0x',
  })

  useEffect(() => {
    if (txnReceipt.isSuccess) {
      const timer = setTimeout(async () => {
        await Promise.all([
          refetchDelegatorPeriodDelegations(),
          refetchDelegations(),
          refetchDelegatorPeriodDelegationsOnValidator(),
        ])
        setDelegationsUpdated(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [txnReceipt.isSuccess])
  const formSchema = createFormSchema({ delegatedAmount: props.delegatedAmount })

  const supportedTokenType =
    props.validator?.support_token_type === undefined || props.validator?.support_token_type === 0
      ? 'LOCKED'
      : 'UNLOCKED'

  const { data: filteredValidatorsData } = useAllValidators({ tokenType: supportedTokenType })

  const filteredValidators = filteredValidatorsData?.allValidators?.filter((validator) => {
    const validatorAddr = validator.operator_address
    const sourceAddr = props.validator.operator_address
    return validatorAddr !== sourceAddr
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      redelegateAmount: '1024',
      sourceValidator: props.validator.description.moniker || props.validator.operator_address,
      destinationValidator: '',
      delegationId: props.delegationId || '1',
    },
    mode: 'onSubmit',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (txnReceipt.isSuccess) return // Prevent resubmission if transaction was successful
    setDelegationsUpdated(false)

    const { redelegateAmount, destinationValidator, delegationId } = values

    const dstValidatorObj = await getValidator({ validatorAddr: destinationValidator as Address })

    const inputs: [Hex, Hex, bigint, bigint] = [
      `0x${base64ToHex(props.validator.consensus_pubkey.value)}`, // validatorUncmpSrcPubkey
      `0x${base64ToHex(dstValidatorObj.consensus_pubkey.value)}`, // validatorUncmpDstPubkey
      BigInt(delegationId), // delegationId
      parseEther(redelegateAmount), // amount
    ]
    console.log({ inputs })
    const txHash = await ipTokenRedelegate({
      value: feeWei,
      args: inputs,
    })

    setStakeTxHash(txHash)
  }

  const maxButtonOnClick = () => {
    form.setValue('redelegateAmount', props.delegatedAmount || '')
  }

  const isTxnPending = txnReceipt.isPending && !!stakeTxHash
  const isOverallPending = isTxnPending || (txnReceipt.isSuccess && !delegationsUpdated)

  let buttonText
  if (!props.delegatedAmount || parseFloat(props.delegatedAmount) === 0) {
    buttonText = 'No IP available to redelegate'
  } else if (isWaitingForWalletConfirmation && !txnReceipt.isSuccess) {
    buttonText = 'Confirm transaction in wallet...'
  } else if (isOverallPending) {
    buttonText = 'Transaction pending...'
  } else if (txnReceipt.isSuccess && delegationsUpdated) {
    buttonText = 'Redelegated!'
  } else {
    buttonText = 'Redelegate IP'
  }
  const isButtonDisabled =
    isTxnPending ||
    (isWaitingForWalletConfirmation && !txnReceipt.isSuccess) ||
    (txnReceipt.isSuccess && delegationsUpdated) ||
    !props.delegatedAmount ||
    parseFloat(props.delegatedAmount) === 0

  const isFormDisabled = isTxnPending || isWaitingForWalletConfirmation || (txnReceipt.isSuccess && !delegationsUpdated)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
        <>
          <h2 className="text-2xl font-bold">Redelegate IP</h2>
          <p>
            {`Redelegate operation allows a delegator to move its staked tokens from one validator to another. The destination validator must support the same token type (locked/unlocked) as the source validator.`}{' '}
            Learn more about redelegation from the{' '}
            <a
              href="https://docs.story.foundation/docs/tokenomics-staking#redelegate"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              documentation
            </a>
            .
          </p>

          <section className="flex flex-col">
            <p className="font-semibold">Redelegation Fee</p>
            <p className="text-primary-outline">{feeEther} IP</p>
          </section>

          <FormField
            control={form.control}
            name="sourceValidator"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold text-white">Source Validator</FormLabel>
                <FormControl>
                  <Input
                    className="border-primary-border bg-black font-normal text-white"
                    placeholder="Enter source validator uncompressed public key"
                    {...field}
                    value={field.value ? `0x${field.value.slice(2)}` : ''}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinationValidator"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold text-white">Destination Validator</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={isFormDisabled}>
                      <SelectValue placeholder="Select a validator to redelegate to" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black text-white">
                    {filteredValidators?.map((validator) => (
                      <SelectItem key={validator.operator_address} value={validator.operator_address}>
                        {validator.description?.moniker || validator.operator_address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delegationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold text-white">Delegation ID</FormLabel>
                <FormControl>
                  <Input
                    className="border-primary-border bg-black font-normal text-white"
                    placeholder="Enter delegation ID..."
                    {...field}
                    disabled={!!props.delegationId}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="redelegateAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold text-white">
                  Amount to Redelegate (
                  {props.delegatedAmount ? formatLargeMetricsNumber(props.delegatedAmount) + ' IP' : '0 IP'} available)
                </FormLabel>
                <FormControl>
                  <div className="flex h-12 w-full items-center justify-between rounded-lg border-[1px] border-solid border-primary-border bg-black pr-2">
                    <Input
                      className="border-none bg-black font-normal text-white placeholder-gray-500 outline-none placeholder:text-white placeholder:opacity-50 focus:border-0 focus:border-none focus:outline-none focus:ring-0 focus:ring-transparent"
                      placeholder="Enter amount (minimum 1024 IP)..."
                      {...field}
                      disabled={isFormDisabled}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="ml-2 text-white text-opacity-50">IP</span>
                      <button
                        type="button"
                        className="rounded-xl bg-sp-purple px-3 py-1 text-xs text-white"
                        onClick={maxButtonOnClick}
                        disabled={isButtonDisabled}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn(
              'flex w-full flex-row gap-2 font-semibold',
              isButtonDisabled ? 'cursor-not-allowed opacity-50' : '',
              txnReceipt.isSuccess && delegationsUpdated
                ? 'bg-green-500 text-white opacity-100 hover:bg-green-500'
                : 'bg-primary'
            )}
            disabled={isButtonDisabled}
            onClick={(e) => {
              if (txnReceipt.isSuccess && delegationsUpdated) {
                e.preventDefault()
              }
            }}
          >
            {(isTxnPending || isWaitingForWalletConfirmation) && <LoaderCircle className="animate-spin" />}
            {buttonText}
          </Button>
        </>
      </form>
      {txnReceipt.isSuccess && delegationsUpdated && <ViewTransaction txHash={stakeTxHash} />}
    </Form>
  )
}
