import { type VariantProps, cva } from 'class-variance-authority'
import { ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import TooltipWrapper from '../TooltipWrapper'
import { Skeleton } from '../ui/skeleton'

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
  tooltip?: string
  footer?: string
  className?: string
  isFetching?: boolean
  isError?: boolean
} & VariantProps<typeof dataCardVariants>

export default function StakingDataCard(props: StakingDataCardProps) {
  const percentChange: string = '0'

  return (
    <div
      className={cn(
        dataCardVariants({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
    >
      {props.tooltip ? (
        <TooltipWrapper content={props.tooltip} className="bg-white">
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
    </div>
  )
}

export function StakingDataCardSkeleton(
  props: { title?: string; className?: string } & VariantProps<typeof dataCardVariants>
) {
  return (
    <div
      className={cn(
        dataCardVariants({
          variant: props.variant,
          size: props.size,
          className: props.className,
        })
      )}
    >
      {props.title && <p className="text-lg text-primary-outline">{props.title}</p>}
      <Skeleton className="h-12 w-full animate-pulse rounded-md bg-white/20" />
    </div>
  )

  // <Skeleton className='h-40 w-40' />
}
