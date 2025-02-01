'use client'

import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { Column, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Address, formatEther, zeroAddress } from 'viem'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { useUnbondedDelegatorDelegations } from '@/lib/services/hooks/useUnbondedDelegatorDelegations'
import { cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

export default function UnbondedDelegationsTable(props: { delegatorEvmAddr: Address }) {
  const isSmallDevice = useIsSmallDevice()

  const { data: unbondedDelegations, isLoading } = useUnbondedDelegatorDelegations({
    delegatorAddr: props.delegatorEvmAddr || zeroAddress,
  })

  if (isLoading) {
    return <SkeletonTable />
  }

  return (
    <div className="rounded-[32px] border-none bg-primary-grey p-2 text-base text-white lg:p-8">
      <h1 className="p-4">Unbonding Delegations</h1>
      <div className="border-grey mb-4 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30">
            <TableHead className="w-[45%]">Validator</TableHead>
            <TableHead className="w-[10%]">Unbonding Height</TableHead>
            <TableHead className="w-[10%]">Unbonding ID</TableHead>
            {/* <TableHead className="w-[10%]">Initial Amount</TableHead> */}
            <TableHead className="w-[10%]">Amount</TableHead>
            <TableHead className="w-[20%]">Completion Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!unbondedDelegations?.unbonding_responses ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No unbonding delegations
              </TableCell>
            </TableRow>
          ) : (
            unbondedDelegations.unbonding_responses.map((unbonding: any) => {
              const validatorMoniker = isSmallDevice
                ? truncateAddress(unbonding.validator_address)
                : unbonding.validator_address

              return unbonding.entries.map((entry: any, index: any) => (
                <TableRow key={`${unbonding.validator_address}-${index}`} className="border-none">
                  <TableCell className="break-words">
                    <div className="flex flex-row items-center gap-2">
                      <div className="aspect-square h-6 w-6 flex-shrink-0">
                        <Image
                          src={`https://cdn.stamp.fyi/avatar/${unbonding.validator_address}`}
                          alt="Validator Avatar"
                          className="h-full w-full rounded-[4px] object-cover"
                          width={24}
                          height={24}
                        />
                      </div>
                      <span className="text-lg">{validatorMoniker}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.creation_height}</TableCell>
                  <TableCell>{entry.unbonding_id}</TableCell>
                  {/* <TableCell className="break-words">
                    {formatLargeMetricsNumber(
                      formatEther(BigInt(parseInt(entry.initial_balance)), 'gwei')
                    )}{' '}
                    IP
                  </TableCell> */}
                  <TableCell className="break-words">
                    {formatLargeMetricsNumber(formatEther(BigInt(parseInt(entry.balance)), 'gwei'))}{' '}
                    IP
                  </TableCell>
                  <TableCell className="break-words">
                    <span
                      className={
                        new Date(entry.completion_time) < new Date()
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }
                    >
                      {new Date(entry.completion_time) < new Date() ? (
                        'Completed'
                      ) : (
                        <>
                          {(() => {
                            const endTime = new Date(entry.completion_time)
                            const now = new Date()
                            const diffMs = endTime.getTime() - now.getTime()
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                            const diffHours = Math.floor(
                              (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                            )

                            const timeLeftText =
                              diffDays > 0
                                ? `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} left`
                                : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} left`

                            const endTimeStr = endTime.toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })

                            return (
                              <div className="flex flex-col">
                                <div>{timeLeftText}</div>
                                <div>{endTimeStr}</div>
                              </div>
                            )
                          })()}
                        </>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="rounded-[32px] border-none bg-primary-grey p-8 text-base text-white">
      <h1>Unbonding Delegations</h1>
      <div className="border-grey mb-4 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30">
            <TableHead className="w-[45%]">Validator</TableHead>
            <TableHead className="w-[15%]">Unbonding ID</TableHead>
            <TableHead className="w-[10%]">Amount</TableHead>
            <TableHead className="w-[20%]">Completion Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i} className="border-none">
              <TableCell>
                <div className="h-6 w-48 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-36 animate-pulse rounded bg-gray-700" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
