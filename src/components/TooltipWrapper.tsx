import { InfoIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export default function TooltipWrapper(props: {
  children: React.ReactNode
  content: React.ReactNode | string | undefined
  className?: string
}) {
  if (!props.content) {
    return <>{props.children}</>
  }

  return (
    <span className="inline-flex items-center gap-2">
      {/* This ensures text and icon are side-by-side in one line */}
      {props.children}
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-primary-outline" />
          </TooltipTrigger>
          <TooltipContent
            className={cn(
              props.className,
              'max-w-prose bg-gray-900 text-gray-50 border-gray-700 text-xs leading-[18px] tracking-[0.48px] p-3'
            )}
          >
            {props.content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  )
}
// relative w-64 rounded-lg border border-gray-700 bg-gray-900 p-3 text-xs leading-4 tracking-[0.48px] text-gray-50"
