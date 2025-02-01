import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/90 text-white rounded-2xl',
        primary: 'bg-white text-black rounded-lg font-medium',
        destructive: 'bg-red-500 text-neutral-50 hover:bg-red-500/90',
        outline: 'border border-neutral-200 bg-black text-white hover:bg-white/30',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80',
        ghost: 'hover:bg-neutral-100 hover:text-neutral-900',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        disabled: 'border border-neutral-200 bg-transparent text-white/50 cursor-not-allowed',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-[32px] px-4',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  isSuccess?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading, isSuccess, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={isSuccess}
      >
        <div className={cn('my-auto flex flex-row items-center gap-2')}>
          {children}
          {isLoading && <Loader className="my-auto flex animate-spin" />}
        </div>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
