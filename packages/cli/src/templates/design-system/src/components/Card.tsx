import React from 'react'
import { cn } from '../utils/cn.js'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
