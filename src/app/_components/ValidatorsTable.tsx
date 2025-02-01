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
import { useState } from 'react'
import { useWindowSize } from 'react-use'
import { formatEther } from 'viem'

import { DataTablePagination } from '@/components/DataTablePagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAllValidators } from '@/lib/services/hooks/useAllValidators'
import { Validator } from '@/lib/types'
import { cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

export function ValidatorsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const v = useAllValidators({})
  const validators = v.data
  const isFetched = v.isFetched
  const isPending = v.isPending
  const size = useWindowSize()
  console.log(validators)

  const columns: ColumnDef<Validator>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Validator'}
            sorting={sorting}
            className="w-full grow"
          />
        )
      },
      cell: ({ row }) => {
        const moniker = row.original.description.moniker

        const name = row.original.consensus_pubkey.value.evm_address
          ? size.width > 768
            ? row.original.consensus_pubkey.value.evm_address
            : truncateAddress(row.original.consensus_pubkey.value.evm_address, 6, 4)
          : ''

        return (
          <div className="flex flex-row gap-2">
            <Image
              src={`https://cdn.stamp.fyi/avatar/${row.original.consensus_pubkey.value.evm_address}`}
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
    {
      accessorKey: 'supportedToken',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Supported Token Type'}
            sorting={sorting}
            className="justify-center"
          />
        )
      },
      cell: ({ row }) => {
        const text =
          row.original.support_token_type === undefined || row.original.support_token_type === 0
            ? 'Locked'
            : 'Unlocked'
        return <div className="text-center">{text}</div>
      },
    },
    {
      accessorKey: 'uptime',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Uptime'}
            sorting={sorting}
            className="justify-center"
          />
        )
      },
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue('uptime')}</div>
      },
    },
    {
      accessorKey: 'commission',
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
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {(Number(row.original.commission.commission_rates.rate) * 100).toFixed(2)}%{' '}
          </div>
        )
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
      <section className="flex w-full flex-row gap-8">
        {/* <ValidatorSearchBar table={table} className='w-full' /> */}
        {/* <SelectValidatorsFilter /> */}
      </section>

      <div className="relative flex min-h-[600px] flex-col rounded-[32px] border-none bg-primary-grey p-2 text-base text-white lg:p-8">
        <Table>
          <TableHeader className="bg-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id} className="bg-transparent">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <Link
                        href={`/validators/${row.original.consensus_pubkey.value.evm_address}`}
                        key={row.id}
                      >
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
        {table.getRowModel().rows?.length > 0 && <DataTablePagination table={table} />}
      </div>
    </>
  )
}

function HeaderWithSortArrows({
  column,
  header,
  sorting,
  className,
}: {
  column: Column<Validator, unknown>
  header: string
  sorting: SortingState
  className?: string
}) {
  const isAscSorted = sorting.some((sort) => sort.id === column.id && sort.desc === false)
  const isDescSorted = sorting.some((sort) => sort.id === column.id && sort.desc === true)

  return (
    <div className={cn('flex flex-row', className)}>
      <p className="text-center font-bold lg:text-xl">{header}</p>
      {/* <ArrowUp
        className={cn(
          'my-auto h-4 w-4 stroke-1 hover:cursor-pointer hover:stroke-2 active:stroke-2',
          isAscSorted && 'stroke-2',
        )}
        onClick={() => column.toggleSorting(false)}
      />
      <ArrowDown
        className={cn(
          'my-auto h-4 w-4 stroke-1 hover:cursor-pointer hover:stroke-2 active:stroke-2',
          isDescSorted && 'stroke-2',
        )}
        onClick={() => column.toggleSorting(true)}
      /> */}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Skeleton className="min-h-[600px] rounded-[32px] border-none bg-primary-grey p-2 text-base text-white lg:p-8" />
  )
}
