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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-primary-outline" />
          </TooltipTrigger>
          <TooltipContent className={cn(props.className, 'max-w-prose bg-white text-black')}>
            {props.content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  )
}
