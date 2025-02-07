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
import { ArrowDown, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Address, formatEther, isAddressEqual } from 'viem'

import { DataTablePagination } from '@/components/DataTablePagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'
import { useValidatorDelegations } from '@/lib/services/hooks/useValidatorDelegations'
import { Delegation, DelegationBalance, Validator } from '@/lib/types'
import { cn, formatLargeMetricsNumber, truncateAddress } from '@/lib/utils'

export default function DelegatorsTable(props: { validator: Validator }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const isSmallDevice = useIsSmallDevice()

  const { data: validatorDelegations, isLoading } = useValidatorDelegations({
    validatorAddr: props.validator.operator_address,
  })

  const columns: ColumnDef<{
    delegation: Delegation
    balance: DelegationBalance
  }>[] = [
    {
      accessorKey: 'delegation.delegator_address',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows column={column} header={'Address'} sorting={sorting} className="" />
        )
      },
      cell: ({ row }) => {
        let delegatorText
        if (row.original?.delegation.delegator_address) {
          const isDelegatorTheValidator = isAddressEqual(
            row.original?.delegation.delegator_address as Address,
            props.validator?.operator_address as Address
          )
          delegatorText = isDelegatorTheValidator ? ' (Self-delegation)' : ''
        }

        return (
          <Link
            href={`/delegations/${row.original?.delegation.delegator_address}`}
            className="flex flex-row gap-2"
          >
            <Image
              src={`https://cdn.stamp.fyi/avatar/${row.original?.delegation.delegator_address}`}
              alt="Avatar thumbnail"
              className="rounded-[4px]"
              width={24}
              height={24}
            />
            <p className="">
              {(isSmallDevice
                ? truncateAddress(row.original?.delegation.delegator_address, 10, 4)
                : row.original?.delegation.delegator_address) + delegatorText}
            </p>
          </Link>
        )
      },
    },
    {
      accessorKey: 'balance.amount',
      header: ({ column }) => {
        return (
          <HeaderWithSortArrows
            column={column}
            header={'Total Stake'}
            sorting={sorting}
            className=""
          />
        )
      },
      cell: ({ row }) => {
        return (
          <p className="">
            {formatLargeMetricsNumber(formatEther(BigInt(row.original.balance.amount), 'gwei'))} IP
          </p>
        )
      },
    },
  ]

  const table = useReactTable({
    data: validatorDelegations?.delegation_responses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <>
      <div className="rounded-[32px] border-none bg-primary-grey p-8 text-base text-white">
        <h1>Delegations</h1>
        <div className="border-grey mb-2 mt-2 border-b" />

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Fetching...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-none transition-colors hover:bg-primary-grey/10"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        {validatorDelegations?.delegation_responses?.length &&
          validatorDelegations?.delegation_responses?.length > 0 && (
            <DataTablePagination table={table} />
          )}
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
  column: Column<{ delegation: Delegation; balance: DelegationBalance }, unknown>
  header: string
  sorting: SortingState
  className?: string
}) {
  const isAscSorted = sorting.some((sort) => sort.id === column.id && sort.desc === false)
  const isDescSorted = sorting.some((sort) => sort.id === column.id && sort.desc === true)

  const hideArrows = true

  if (hideArrows)
    return (
      <div className={cn('flex flex-row items-center', className)}>
        <p className="mr-1 font-bold">{header}</p>
      </div>
    )

  return (
    <div className={cn('flex flex-row items-center', className)}>
      <p className="mr-1 font-bold">{header}</p>
      <div className="flex flex-col">
        <ArrowUp
          className={cn(
            'h-3 w-3 cursor-pointer stroke-1',
            isAscSorted ? 'stroke-white' : 'stroke-gray-400'
          )}
          onClick={() => column.toggleSorting(false)}
        />
        <ArrowDown
          className={cn(
            'h-3 w-3 cursor-pointer stroke-1',
            isDescSorted ? 'stroke-white' : 'stroke-gray-400'
          )}
          onClick={() => column.toggleSorting(true)}
        />
      </div>
    </div>
  )
}
