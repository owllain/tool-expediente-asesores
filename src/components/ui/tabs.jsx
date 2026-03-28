import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
    const [selectedTab, setSelectedTab] = React.useState(defaultValue || value)

    React.useEffect(() => {
        if (value !== undefined && value !== selectedTab) {
            setSelectedTab(value)
        }
    }, [value])

    const handleTabChange = (newValue) => {
        if (value === undefined) {
            setSelectedTab(newValue)
        }
        if (onValueChange) {
            onValueChange(newValue)
        }
    }

    return (
        <div className={cn("w-full", className)}>
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { selectedTab, onTabChange: handleTabChange })
            )}
        </div>
    )
}

const TabsList = ({ children, selectedTab, onTabChange, className }) => {
    return (
        <div
            className={cn(
                "inline-flex h-auto items-center justify-center rounded-xl bg-secondary/60 p-1.5 text-muted-foreground shadow-inner",
                className
            )}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { selectedTab, onTabChange })
            )}
        </div>
    )
}

const TabsTrigger = ({ value, children, selectedTab, onTabChange, className }) => {
    const isSelected = selectedTab === value

    return (
        <button
            onClick={() => onTabChange(value)}
            data-selected={isSelected}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5",
                className
            )}
        >
            {children}
        </button>
    )
}

const TabsContent = ({ value, children, selectedTab, className }) => {
    if (selectedTab !== value) return null

    return (
        <div
            className={cn(
                "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-slide-in-up",
                className
            )}
        >
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
