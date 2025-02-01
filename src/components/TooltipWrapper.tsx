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
    <div className="flex flex-row gap-2">
      {props.children}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-primary-outline" />
          </TooltipTrigger>
          <TooltipContent
            className={cn(props.className, 'max-w-prose bg-white text-left text-black')}
          >
            {props.content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
