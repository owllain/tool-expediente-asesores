import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200",
        gradient: "gradient-primary text-white shadow-primary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        outline: "border-2 border-input bg-background hover:bg-secondary/50 hover:border-primary/30 transition-all duration-200",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-sm hover:shadow-md transition-all duration-200",
    }

    const sizes = {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
