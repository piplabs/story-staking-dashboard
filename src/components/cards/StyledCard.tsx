import { cn } from '@/lib/utils'

interface StyledCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function StyledCard({ children, className, ...props }: StyledCardProps) {
  return (
    <div
      className={cn('rounded-[16px] bg-primary-surface px-8 py-6 border border-primary-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}
