import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'default' | 'outline' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-ink text-white hover:bg-black',
        variant === 'outline' && 'border border-black/10 bg-white hover:bg-black/[.03]',
        variant === 'ghost' && 'hover:bg-black/[.05]',
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
