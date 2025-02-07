'use client'

import { ExternalLinkIcon } from '@radix-ui/react-icons'
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import { useState } from 'react'
import { Address, formatEther, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

import { DataTablePagination } from '@/components/DataTablePagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEvmOperations } from '@/lib/services/hooks/useEvmOperations'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { EvmOperation } from '@/lib/types/networkApiTypes'
import { cn, truncateAddress } from '@/lib/utils'

export default function ActivityTable(props: { delegatorEvmAddr: Address }) {
  const { chain } = useAccount()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const explorerUrl =
    chain && chain.blockExplorers
      ? chain.blockExplorers.default.url
      : process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: operations, isLoading } = useEvmOperations({
    evmAddr: props.delegatorEvmAddr || zeroAddress,
    page: pageIndex + 1,
    pageSize,
  })

  const table = useReactTable({
    data: operations?.operations || [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: operations ? Math.ceil(operations.total / pageSize) : 0,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return <SkeletonTable />
  }

  return (
    <div className="rounded-[32px] border-none bg-primary-grey p-4 text-base text-white lg:p-8">
      <h1 className="p-2">Transactions</h1>
      <div className="border-grey mb-2 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30 text-center">
            <TableHead className="w-[10%] text-center">Status</TableHead>
            <TableHead className="w-[20%] text-center">Event Type</TableHead>
            <TableHead className="w-[20%] text-center">Value</TableHead>
            <TableHead className="w-[25%] text-center">Validator (EVM address)</TableHead>
            <TableHead className="w-[20%] text-center">Block Height</TableHead>
            <TableHead className="w-[20%] text-center">Txn Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const operation = row.original as EvmOperation

              return (
                <TableRow key={row.id} className="border-none">
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'capitalize',
                        operation.status_ok === true
                          ? 'text-green-500'
                          : operation.status_ok === false
                            ? 'text-red-500'
                            : ''
                      )}
                    >
                      {operation.status_ok ? 'Success' : 'Fail'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {operation.event_type}
                  </TableCell>
                  <TableCell className="text-center">
                    {operation.amount ? `${formatEther(BigInt(operation.amount), 'gwei')} IP` : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/validators/${operation.dst_validator_address}`}
                      className="flex flex-row justify-center gap-2"
                    >
                      {truncateAddress(operation.dst_validator_address, 8, 6)}
                      <div className="my-auto flex">
                        <ExternalLinkIcon className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{operation.block_height}</TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`${explorerUrl}/tx/${operation.tx_hash}`}
                      className="flex flex-row justify-center gap-2"
                    >
                      {truncateAddress(operation.tx_hash)}
                      <div className="my-auto flex">
                        <ExternalLinkIcon className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {operations && operations.total > 10 && <DataTablePagination table={table} />}
    </div>
  )
}
function SkeletonTable() {
  return (
    <div className="rounded-[32px] border-none bg-primary-grey p-8 text-base text-white">
      <h1>Transactions</h1>
      <div className="border-grey mb-2 mt-2" />
      <Table>
        <TableHeader>
          <TableRow className="border-white/30 text-center">
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[20%]">Event Type</TableHead>
            <TableHead className="w-[20%]">Value</TableHead>
            <TableHead className="w-[20%]">Block Height</TableHead>
            <TableHead className="w-[20%]">Txn Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i} className="border-none">
              <TableCell>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
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
