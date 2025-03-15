'use client'

import {
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Address, formatEther, isAddressEqual, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

import TooltipWrapper from '@/components/TooltipWrapper'
import { RedelegateDialog } from '@/components/dialogs/RedelegateDialog'
import { UnstakeDialog } from '@/components/dialogs/UnstakeDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getValidator } from '@/lib/services/api/validatorApi'
import { useDelegatorPeriodDelegations } from '@/lib/services/hooks/useDelegatorPeriodDelegations'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'
import StyledCard from '@/components/cards/StyledCard'
import { useSingularity } from '@/lib/services/hooks/useSingularity'
import { StakingPeriodMultiplierInfo } from '@/lib/types'
import { LOCKED_STAKING_PERIODS, STAKING_PERIODS } from '@/lib/constants'
import { DataTablePagination } from '@/components/DataTablePagination'

export default function DelegationsTable(props: { delegatorEvmAddr: Address }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [validatorDetails, setValidatorDetails] = useState<Record<string, any>>({})
  const { isSingularity } = useSingularity()
  const isSmallDevice = useIsSmallDevice()
  const { address: connectedAddress, isConnected } = useAccount()
  const isDelegatorTheOwner =
    isConnected && connectedAddress && isAddressEqual(connectedAddress, props.delegatorEvmAddr)

  const {
    data: delegatorPeriodDelegations,
    isLoading,
    isPending,
  } = useDelegatorPeriodDelegations({
    delegatorAddr: props.delegatorEvmAddr,
  })

  const isDelegatorMatchConnectedWallet = connectedAddress?.toLowerCase() === props.delegatorEvmAddr.toLowerCase()

  const table = useReactTable({
    data: delegatorPeriodDelegations || [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const validatorAddresses = useMemo(
    () => delegatorPeriodDelegations?.map((d) => d.validatorAddr) || [],
    [delegatorPeriodDelegations]
  )

  useEffect(() => {
    async function fetchValidators() {
      if (!delegatorPeriodDelegations) return

      const details: Record<string, any> = {}
      await Promise.all(
        delegatorPeriodDelegations.map(async (delegation) => {
          if (!delegation.validatorAddr) return

          try {
            const data = await getValidator({ validatorAddr: delegation.validatorAddr })
            details[delegation.validatorAddr] = data
          } catch (error) {
            console.error(`Error fetching validator ${delegation.validatorAddr}:`, error)
          }
        })
      )
      setValidatorDetails(details)
    }

    fetchValidators()
  }, [validatorAddresses.join(','), isPending])

  if (isLoading || isPending) {
    return <SkeletonTable />
  }
  return (
    <StyledCard className="text-base text-white">
      <h1 className="p-4 md:p-0">Bonded Delegations</h1>
      <div className="border-grey mb-4 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30">
            <TableHead className="w-[10%] align-middle">Validator</TableHead>
            <TableHead className="hidden w-[12%] text-center align-middle md:table-cell">
              <TooltipWrapper content='A unique identifier assigned to each delegation transaction between a delegator and validator. All Flexible stakes are assigned to "0"'>
                Delegation ID
              </TooltipWrapper>
            </TableHead>
            <TableHead className="w-[10%] text-center align-middle">Amount</TableHead>
            <TableHead className="w-[15%] text-center align-middle">
              <TooltipWrapper content="The duration for which tokens are staked. Flexible staking allows unstaking anytime, while fixed periods offer higher reward multipliers but require waiting until maturity.">
                Staking Period
              </TooltipWrapper>
            </TableHead>
            <TableHead className="hidden w-[5%] text-center align-middle md:table-cell">
              <TooltipWrapper content="The reward multiplier applied to staking rewards based on the chosen staking period. Longer staking periods offer higher multipliers.">
                Multiplier
              </TooltipWrapper>
            </TableHead>
            <TableHead className="w-[12%] justify-center align-middle">
              <div className="mx-auto flex">
                <TooltipWrapper content="The date and time when staked tokens will become available for unstaking and redelegating. Only applies to fixed period staking.">
                  Maturity Time
                </TooltipWrapper>
              </div>
            </TableHead>
            {isDelegatorMatchConnectedWallet && (
              <TableHead className="hidden w-[20%] align-middle md:table-cell text-center">
                Actions {isSingularity && '(Disabled during Singularity)'}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {delegatorPeriodDelegations?.length === 0 && !isLoading && !isPending ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No delegations
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row: any) => {
              const validatorDelegation = row.original
              return validatorDelegation.periodDelegations?.period_delegation_responses?.map(
                (periodDelegation: any, pIndex: number) => {
                  const isMatured = new Date(periodDelegation.period_delegation.end_time) < new Date()

                  const validator = validatorDetails[periodDelegation.period_delegation.validator_address]
                  const isLockedTokenStaking =
                    validator?.support_token_type === undefined || validator?.support_token_type == 0

                  const stakingPeriods = isLockedTokenStaking ? LOCKED_STAKING_PERIODS : STAKING_PERIODS
                  return (
                    <TableRow key={pIndex} className="border-none">
                      <TableCell className="break-words">
                        {validator ? (
                          <Link
                            href={`/validators/${periodDelegation.period_delegation.validator_address}`}
                            className="relative flex flex-row gap-2"
                          >
                            <Image
                              src={`https://cdn.stamp.fyi/avatar/${periodDelegation.period_delegation.validator_address}`}
                              alt="Validator Avatar"
                              className="my-auto flex h-6 w-6 rounded-[4px]"
                              width={24}
                              height={24}
                            />
                            <span className="md:text-lg">
                              {isSmallDevice
                                ? truncateAddress(validator.description.moniker)
                                : validator.description.moniker}
                            </span>
                            {/* <div className="my-auto hidden md:flex">
                              <ExternalLinkIcon className="ml-1 h-4 w-4" />
                            </div> */}
                          </Link>
                        ) : (
                          <div className="flex flex-row gap-2">
                            <Image
                              src={`https://cdn.stamp.fyi/avatar/${pIndex}`}
                              alt="Validator Avatar"
                              className="rounded-[4px]"
                              width={24}
                              height={24}
                            />
                            <span className="text-lg">{periodDelegation.period_delegation.validator_address}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden h-full text-center align-middle md:table-cell">
                        {periodDelegation.period_delegation.period_delegation_id}
                      </TableCell>
                      <TableCell className="break-words text-center align-middle">
                        {formatLargeMetricsNumber(
                          formatEther(BigInt(parseInt(periodDelegation.balance.amount.toString())), 'gwei')
                        )}{' '}
                        IP
                      </TableCell>
                      <TableCell className="break-words text-center">
                        {periodDelegation.period_delegation.period_type !== undefined
                          ? stakingPeriods[process.env.NEXT_PUBLIC_CHAIN_ID].find(
                              (period: StakingPeriodMultiplierInfo) =>
                                period.value === periodDelegation.period_delegation.period_type.toString()
                            )?.label + ''
                          : 'Flexible'}
                      </TableCell>
                      <TableCell className="hidden break-words text-center md:table-cell">
                        {periodDelegation.period_delegation.period_type !== undefined
                          ? stakingPeriods[process.env.NEXT_PUBLIC_CHAIN_ID].find(
                              (period: StakingPeriodMultiplierInfo) =>
                                period.value === periodDelegation.period_delegation.period_type.toString()
                            )?.multiplier
                          : '1.0x'}
                      </TableCell>
                      <TableCell className="">
                        {(() => {
                          const endTime = new Date(periodDelegation.period_delegation.end_time)
                          if (endTime < new Date()) {
                            return (
                              <div className="">
                                <span className="text-green-500">Matured</span>
                              </div>
                            )
                          }
                          const formattedEndTime = endTime.toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                          return (
                            <TooltipWrapper content={`Matures ${formattedEndTime}`}>
                              <div className="">
                                <span className="text-yellow-500">Maturing</span>
                              </div>
                            </TooltipWrapper>
                          )
                        })()}
                      </TableCell>
                      {isDelegatorTheOwner && (
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-row gap-4">
                            <UnstakeDialog
                              validator={validator}
                              isUnstakeDisabled={!isMatured}
                              delegationId={periodDelegation.period_delegation.period_delegation_id}
                              isMatured={isMatured}
                            />

                            <RedelegateDialog
                              validator={validator}
                              delegationId={periodDelegation.period_delegation.period_delegation_id}
                              delegatedAmount={formatEther(
                                BigInt(parseInt(periodDelegation.balance.amount.toString())),
                                'gwei'
                              )}
                            />
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                }
              )
            })
          )}
        </TableBody>
      </Table>
      {delegatorPeriodDelegations && <DataTablePagination table={table} />}
    </StyledCard>
  )
}

function SkeletonTable() {
  return (
    <StyledCard className="">
      <h1 className="p-4 md:p-0">Bonded Delegations</h1>
      <div className="border-grey mb-4 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30">
            <TableHead className="w-[30%] align-middle">Validator</TableHead>
            <TableHead className="hidden w-[15%] text-center align-middle md:table-cell">
              <TooltipWrapper content='A unique identifier assigned to each delegation transaction between a delegator and validator. All Flexible stakes are assigned to "0"'>
                Delegation ID
              </TooltipWrapper>
            </TableHead>
            <TableHead className="w-[10%] text-center align-middle">Amount</TableHead>
            <TableHead className="w-[15%] text-center align-middle">
              <TooltipWrapper content="The duration for which tokens are staked. Flexible staking allows unstaking anytime, while fixed periods offer higher reward multipliers but require waiting until maturity.">
                Staking Period
              </TooltipWrapper>
            </TableHead>
            <TableHead className="hidden w-[10%] text-center align-middle md:table-cell">
              <TooltipWrapper content="The reward multiplier applied to staking rewards based on the chosen staking period. Longer staking periods offer higher multipliers.">
                Multiplier
              </TooltipWrapper>
            </TableHead>
            <TableHead className="w-[20%] justify-center align-middle">
              <div className="mx-auto flex">
                <TooltipWrapper content="The date and time when staked tokens will become available for unstaking and redelegating. Only applies to fixed period staking.">
                  Maturity Time
                </TooltipWrapper>
              </div>
            </TableHead>
            <TableHead className="hidden w-[10%] align-middle md:table-cell">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i} className="border-none">
              <TableCell className="break-words">
                <div className="flex flex-row gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-[4px] bg-gray-700" />
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-700" />
                </div>
              </TableCell>
              <TableCell className="hidden h-full text-center align-middle md:table-cell">
                <div className="mx-auto h-5 w-20 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell className="break-words text-center align-middle">
                <div className="mx-auto h-5 w-24 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell className="break-words text-center">
                <div className="mx-auto h-5 w-24 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell className="hidden break-words text-center md:table-cell">
                <div className="mx-auto h-5 w-16 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell className="break-words text-center">
                <div className="mx-auto h-10 w-36 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-row gap-4">
                  <div className="h-7 w-7 animate-pulse rounded bg-gray-700" />
                  <div className="h-7 w-7 animate-pulse rounded bg-gray-700" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledCard>
  )
}
