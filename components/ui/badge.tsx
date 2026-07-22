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
        warning: "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        info: "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        gold: "border-[#c4a484]/30 bg-[#c4a484]/10 text-[#c4a484] hover:bg-[#c4a484]/20",
        luxury: "border-[#c4a484]/30 bg-[#c4a484]/10 text-[#c4a484] hover:bg-[#c4a484]/20",
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
