import { Column, SortingState } from '@tanstack/react-table'
import React, { ReactNode, useState } from 'react'

import { Validator } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function HeaderWithSortArrows<T>({
  column,
  header,
  sorting,
  className,
  isShowArrows = true,
}: {
  column: Column<T, unknown>
  header: string | ReactNode
  sorting: SortingState
  className?: string
  isShowArrows?: boolean
}) {
  const isAscSorted = sorting.some((sort) => sort.id === column.id && sort.desc === false)
  const isDescSorted = sorting.some((sort) => sort.id === column.id && sort.desc === true)

  // Helper to strip any non-numeric characters (like units or % signs)
  const parseNumericValue = (value: unknown): number => {
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '')
      return parseFloat(cleaned) || 0
    }
    return Number(value) || 0
  }

  // Handler that sets a custom sort function before toggling sorting.
  const handleSort = (desc: boolean) => {
    if (column.id === 'name') {
      // Use proper string sorting for the Validator column.
      column.columnDef.sortingFn = (rowA, rowB, columnId) => {
        console.log({ rowA, rowB })
        const a = rowA.getValue(columnId)?.toString().toLowerCase() || ''
        const b = rowB.getValue(columnId)?.toString().toLowerCase() || ''
        return a.localeCompare(b)
      }
      column.toggleSorting(desc)
    } else {
      // For other columns, use numeric sorting.
      column.columnDef.sortingFn = (rowA, rowB, columnId) => {
        const a = parseNumericValue(rowA.getValue(columnId))
        const b = parseNumericValue(rowB.getValue(columnId))
        return a - b
      }
      column.toggleSorting(desc)
    }
  }

  return (
    <div className={cn('flex flex-row', className)}>
      <div className="text-center lg:text-xl">{header}</div>
      {isShowArrows && (
        <>
          <ArrowUp
            className={cn(
              'my-auto h-4 w-4 stroke-1 hover:cursor-pointer hover:stroke-2 active:stroke-2',
              isAscSorted && 'stroke-2'
            )}
            onClick={() => handleSort(false)}
          />
          <ArrowDown
            className={cn(
              'my-auto h-4 w-4 stroke-1 hover:cursor-pointer hover:stroke-2 active:stroke-2',
              isDescSorted && 'stroke-2'
            )}
            onClick={() => handleSort(true)}
          />
        </>
      )}
    </div>
  )
}
