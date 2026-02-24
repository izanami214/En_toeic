import * as React from "react"
import { cn } from "@/lib/utils"

// Simple Tooltip implementation since we lack Radix UI Tooltip primitives
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = ({ children }: { children: React.ReactNode }) => {
    return <div className="group relative inline-block">{children}</div>;
};

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => {
    return <div className="inline-block cursor-pointer">{children}</div>;
};

const TooltipContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn(
            "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
            "invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200",
            "bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs",
            className
        )}>
            {children}
        </div>
    );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
