import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/85",
        secondary:
          "border-transparent bg-[#27272a] text-[#fafafa] hover:bg-[#27272a]/80",
        destructive:
          "border-transparent bg-destructive text-[#fafafa] hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
        warning: "border-transparent bg-champagne-gold/10 text-champagne-gold hover:bg-champagne-gold/20",
        info: "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        gold: "border-champagne-gold/30 bg-champagne-gold/10 text-champagne-gold hover:bg-champagne-gold/20",
        luxury: "border-champagne-gold/30 bg-champagne-gold/10 text-champagne-gold hover:bg-champagne-gold/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
