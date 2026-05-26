import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-bold transition-all duration-[400ms] ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] capitalize",
  {
    variants: {
      variant: {
        default:
          "btn-gradient-primary text-white shadow-lg shadow-[#A93E17]/25 hover:shadow-xl hover:shadow-[#A93E17]/30 border-none",
        destructive:
          "bg-destructive text-white shadow-lg shadow-destructive/25 hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/30 border-none",
        outline:
          "border-2 border-[#A93E17] bg-transparent text-[#A93E17] shadow-sm hover:bg-gradient-to-r hover:from-[#A93E17] hover:to-[#15399A] hover:text-white hover:border-transparent hover:shadow-md",
        secondary:
          "bg-[#15399A] text-white shadow-lg shadow-[#15399A]/25 hover:bg-[#15399A]/90 hover:shadow-xl hover:shadow-[#15399A]/30 border-none",
        ghost:
          "text-muted-foreground hover:text-[#A93E17] hover:bg-[#A93E17]/10 border-none",
        link: "text-[#A93E17] underline-offset-4 hover:underline",
        gradient:
          "btn-gradient-primary text-white shadow-lg shadow-[#A93E17]/25 hover:shadow-xl hover:shadow-[#A93E17]/30 border-none",
      },
      size: {
        default: "px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 rounded-pill gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "px-8 py-4 text-base has-[>svg]:px-7",
        icon: "size-10 rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
