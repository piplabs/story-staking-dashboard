'use client'

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useState } from 'react'
import { useWindowSize } from 'react-use'
import { formatEther } from 'viem'

import { DataTablePagination } from '@/components/DataTablePagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import { Validator } from '@/lib/types'
import { cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'
import StyledCard from '@/components/cards/StyledCard'
import { ArrowDown, ArrowUp } from 'lucide-react'
import HeaderWithSortArrows from '@/components/HeaderWithSortArrows'

export function ValidatorsTable({
  tokenType,
  showLockedTokens,
  setShowLockedTokens,
}: {
  tokenType: 'UNLOCKED' | 'LOCKED' | 'ALL'
  showLockedTokens: boolean
  setShowLockedTokens: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [hideLocked, setHideLocked] = useState(true)

  const {
    data: validators,
    isFetched,
    isPending,
  } = useAllValidators({ sortDescending: true, sortSupportedToken: true, tokenType })
  const size = useWindowSize()

  // Filter validators based on the toggle.
  // A validator with locked tokens is defined as having support_token_type undefined or 0.
  const columns: ColumnDef<Validator>[] = [
    {
      accessorFn: (row: Validator) =>
        row.description.moniker || (row.operator_address ? truncateAddress(row.operator_address, 6, 4) : ''),
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={
              <p>
                <span className="font-bold">Validator</span> (click to view more details)
              </p>
            }
            sorting={sorting}
            className="w-full grow"
          />
        )
      },
      cell: ({ row }) => {
        const moniker = row.original.description.moniker

        const name = row.original.operator_address
          ? size.width > 768
            ? row.original.operator_address
            : truncateAddress(row.original.operator_address, 6, 4)
          : ''

        return (
          <div className="flex flex-row gap-2">
            <Image
              src={`https://cdn.stamp.fyi/avatar/${row.original.operator_address}`}
              alt="Validator Avatar"
              className="rounded-[4px]"
              width={24}
              height={24}
            />
            <p className="">{moniker ? moniker : name}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'totalStakedAmount',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Total Staked'}
            sorting={sorting}
            className="justify-center text-center"
          />
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {formatLargeMetricsNumber(formatEther(BigInt(row.original.tokens), 'gwei').toString(), {
              useSuffix: false,
            })}{' '}
            IP
          </div>
        )
      },
    },
    ...(showLockedTokens
      ? [
          {
            accessorKey: 'supportedToken',
            header: ({ column }: any) => {
              return (
                <HeaderWithSortArrows
                  column={column}
                  header={'Supported Token Type'}
                  sorting={sorting}
                  className="justify-center"
                  isShowArrows={false}
                />
              )
            },
            cell: ({ row }: any) => {
              const text =
                row.original.support_token_type === undefined || row.original.support_token_type === 0
                  ? 'Locked'
                  : 'Unlocked'
              return <div className="text-center">{text}</div>
            },
          },
        ]
      : []),
    {
      accessorKey: 'uptime',
      header: ({ column }) => {
        return <HeaderWithSortArrows column={column} header={'Uptime'} sorting={sorting} className="justify-center" />
      },
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue('uptime') || '-'}</div>
      },
    },
    {
      accessorFn: (row: Validator) => Number(row.commission.commission_rates.rate),
      id: 'commission',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Commission'}
            sorting={sorting}
            className="justify-center text-center"
          />
        )
      },
      cell: ({ row, getValue }) => {
        const value = getValue() as number
        return <div className="text-center">{(value * 100).toFixed(2)}% </div>
      },
    },
  ]

  const table = useReactTable({
    data: validators?.allValidators || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (!isFetched || isPending) return <TableSkeleton />

  return (
    <>
      <StyledCard className="relative flex max-h-[780px] flex-col text-base overflow-y-auto scrollbar-hide">
        <Table>
          <TableHeader className="bg-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id} className="bg-transparent">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-1 cursor-pointer border-b border-primary-outline/30 transition-colors hover:bg-white/10"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      <Link href={`/validators/${row.original.operator_address}`} key={row.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {table.getRowModel().rows?.length > 0 && (
          <DataTablePagination
            table={table}
            showLockedTokens={showLockedTokens}
            setShowLockedTokens={setShowLockedTokens}
          />
        )}
      </StyledCard>
    </>
  )
}

function TableSkeleton() {
  return (
    <Skeleton className="min-h-[600px] rounded-[32px] border border-primary-border p-2 text-base text-white lg:p-8" />
  )
}
