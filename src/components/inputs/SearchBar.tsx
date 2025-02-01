import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Input } from '../ui/input'

export type SearchBarProps = {
  className?: string
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <div className={cn('relative ml-auto flex-1 md:grow-0', props.className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-black" />
      <Input
        type="search"
        placeholder="Search for a validator..."
        className="bg-background rounded-lg pl-8 text-black"
      />
    </div>
  )
}
