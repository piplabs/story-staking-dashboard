import { Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'

import { Validator } from '@/lib/types'
import { cn } from '@/lib/utils'

export type SearchBarProps = {
  table: Table<Validator>
  className?: string
}

export default function ValidatorSearchBar(props: SearchBarProps) {
  return (
    <div className={cn('flex flex-row', props.className)}>
      <div className="flex w-full flex-row rounded-lg border border-primary-outline">
        <input
          className={cn(
            'flex h-12 w-full rounded-md bg-transparent px-4 py-2 placeholder:text-neutral-500 focus:ring-0 focus:ring-offset-0'
          )}
          placeholder="Search for a validator"
          value={(props.table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => props.table.getColumn('name')?.setFilterValue(event.target.value)}
        />
        <Search className="my-auto mr-4 h-6 w-6" />
      </div>
    </div>
  )
}
