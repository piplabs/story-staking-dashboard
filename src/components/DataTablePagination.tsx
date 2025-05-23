'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  GearIcon,
} from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@tanstack/react-table'

import { useIsSmallDevice } from '@/lib/services/hooks/useIsSmallDevice'

import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import StyledCard from './cards/StyledCard'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  showLockedTokens?: boolean
  setShowLockedTokens?: React.Dispatch<React.SetStateAction<boolean>>
}

export function DataTablePagination<TData>({
  table,
  showLockedTokens,
  setShowLockedTokens,
}: DataTablePaginationProps<TData>) {
  const isSmallDevice = useIsSmallDevice()
  const isAtLastPage = table.getState().pagination.pageIndex + 1 === table.getPageCount()

  return (
    <div
      className={`mt-8 flex items-center ${isSmallDevice ? 'flex-col gap-4' : 'justify-between space-x-6 lg:space-x-8'}`}
    >
      <div className="flex items-center space-x-2">
        {showLockedTokens !== undefined && setShowLockedTokens !== undefined && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <GearIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <StyledCard className="text-white p-0 border-none rounded-none">
                <DropdownMenuLabel>Advanced Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="hover:bg-white/20 hover:cursor-pointer"
                  checked={showLockedTokens}
                  onCheckedChange={() => setShowLockedTokens((prev) => !prev)}
                >
                  Show Locked Tokens
                </DropdownMenuCheckboxItem>
              </StyledCard>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="bg-primary-grey text-white">
            {[10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        {!isSmallDevice && (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            if (!isAtLastPage) {
              table.nextPage()
            }
          }}
          disabled={!table.getCanNextPage() || isAtLastPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        {!isSmallDevice && (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || isAtLastPage}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
