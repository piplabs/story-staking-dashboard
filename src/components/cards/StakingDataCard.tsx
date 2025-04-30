import { type VariantProps, cva } from 'class-variance-authority'
import { ArrowUp } from 'lucide-react'
import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import TooltipWrapper from '../TooltipWrapper'
import { Skeleton } from '../ui/skeleton'
import StyledCard from './StyledCard'

const dataCardVariants = cva('flex flex-col whitespace-nowrap', {
  variants: {
    variant: {
      default: 'bg-[#1C1C1C] text-black',
    },
    size: {
      default: 'rounded-[32px] py-6 px-8',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type StakingDataCardProps = {
  title: string
  data: string | undefined
  tooltip?: string | React.ReactNode
  footer?: string
  className?: string
  isFetching?: boolean
  isError?: boolean
} & VariantProps<typeof dataCardVariants>

export default function StakingDataCard(props: StakingDataCardProps) {
  return (
    <StyledCard className={cn('w-full flex flex-col whitespace-nowrap ')}>
      {props.tooltip ? (
        <TooltipWrapper content={props.tooltip}>
          <p className="text-lg text-primary-outline">{props.title}</p>
        </TooltipWrapper>
      ) : (
        <p className="text-lg text-primary-outline">{props.title}</p>
      )}
      {props.isError ? (
        <p className="text-5xl font-bold text-white">-</p>
      ) : props.isFetching ? (
        <Skeleton className="h-12 w-48" />
      ) : props.data ? (
        <p className="text-5xl font-bold text-white">{props.data}</p>
      ) : (
        <p className="text-5xl font-bold text-white">-</p>
      )}
      {props.footer ? (
        <p className="text-lg text-primary-outline">{props.footer}</p>
      ) : (
        <p className="text-lg">
          {/* <span className={cn(percChangeTextColor)}>
            {Number(percentChange) === 0 ? '' : Number(percentChange) > 0 ? '↑' : '↓'}
            {percentChange}%
          </span>{' '}
          <span className='text-primary-outline'>last {timeframe}</span> */}
        </p>
      )}
    </StyledCard>
  )
}

type StakingDataCardWithPopoverProps = Omit<StakingDataCardProps, 'title' | 'data'> & {
  title: string
  options: { label: string; value: string }[]
  dataMap: Record<string, string | undefined>
  defaultValue?: string
}

export function StakingDataCardWithPopover({
  title,
  options,
  dataMap,
  defaultValue,
  tooltip,
  footer,
  className,
  isFetching,
  isError,
  ...rest
}: StakingDataCardWithPopoverProps) {
  const [selected, setSelected] = useState<string>(defaultValue ?? options[0]?.value)
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((opt) => opt.value === selected)?.label ?? options[0]?.label
  const data = dataMap[selected]

  return (
    <StyledCard className={cn('w-full flex flex-col whitespace-nowrap transition-shadow hover:shadow-md', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <TooltipWrapper content={tooltip}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-1 pl-1 pr-2 py-1 rounded-md transition border border-transparent',
                'hover:border-primary-outline/30 hover:bg-primary-outline/5 cursor-pointer select-none'
              )}
              tabIndex={0}
              role="button"
              aria-label={`Select ${title} option`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={cn('inline-block transition-transform duration-200', open ? 'rotate-180' : 'rotate-0')}
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="8,11 3,6 13,6" fill="currentColor" />
              </svg>
              <p className="text-lg text-primary-outline">{selectedLabel}</p>
            </div>
          </PopoverTrigger>
        </TooltipWrapper>
        <PopoverContent
          className={cn(' bg-gray-900 text-gray-50 border-gray-700 text-xs leading-[18px] tracking-[0.48px] px-3')}
          align="start"
        >
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <Button
                key={opt.value}
                variant={selected === opt.value ? 'secondary' : 'ghost'}
                className={cn('justify-left rounded-lg', selected === opt.value && 'font-bold')}
                onClick={() => {
                  setSelected(opt.value)
                  setOpen(false)
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {isError ? (
        <p className="text-5xl font-bold text-white">-</p>
      ) : isFetching ? (
        <Skeleton className="h-12 w-48" />
      ) : data ? (
        <p className="text-5xl font-bold text-white">{data}%</p>
      ) : (
        <p className="text-5xl font-bold text-white">-</p>
      )}
    </StyledCard>
  )
}
