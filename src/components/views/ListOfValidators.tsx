'use client'

import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export type SelectValidatorsProps = {
  form: any
  setIsSelectingValidators: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SelectValidators(props: SelectValidatorsProps) {
  return (
    <FormField
      control={props.form.control}
      name="validators"
      render={({ field }) => (
        <FormItem>
          <ListOfValidators
            form={props.form}
            setIsSelectingValidators={props.setIsSelectingValidators}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function ListOfValidators(props: SelectValidatorsProps) {
  return (
    <>
      <h2 className="text-2xl text-white">Select Validator</h2>

      <div className="flex h-12 w-full items-center justify-between rounded-lg border-[1px] border-solid border-stakingModalOutline bg-black px-4">
        <Input
          className="border-none bg-black font-normal text-white placeholder-gray-500 outline-none placeholder:text-white placeholder:opacity-50 focus:border-0 focus:border-none focus:outline-none focus:ring-0 focus:ring-transparent"
          placeholder="Enter Validator..."
        />
        <div className="flex items-center space-x-2">
          <Search color="white" />
        </div>
      </div>
      <h2>Sort By</h2>
      <section className="flex w-full flex-row rounded-2xl border">
        <Button className="w-full">Staked Amount</Button>
        <Button className="w-full" variant="ghost" disabled>
          Commission
        </Button>
      </section>
    </>
  )
}
