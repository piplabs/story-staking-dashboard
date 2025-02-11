import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function SelectValidatorsFilter() {
  return (
    <Select>
      <SelectTrigger className="h-12 w-[180px]">
        <SelectValue placeholder="All Validators" />
      </SelectTrigger>
      <SelectContent className="bg-primary-grey text-white">
        <SelectGroup>
          <SelectItem value="all">All Validators</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="jailed">Jailed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
