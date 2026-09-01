import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type OverlayVariant = "sheet" | "center" | "top";

const variantClasses: Record<OverlayVariant, string> = {
  // Bottom sheet on small screens, centred panel from md up.
  sheet: cn(
    "inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t",
    "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
    "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md",
    "md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:border",
    "md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0",
    "md:data-[state=open]:zoom-in-95 md:data-[state=closed]:zoom-out-95",
  ),
  center: cn(
    "inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t",
    "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
    "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md",
    "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border",
    "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0",
    "sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95",
  ),
  // Drops below the sticky header.
  top: cn(
    "inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b",
    "data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4",
  ),
};

const Overlay = DialogPrimitive.Root;
const OverlayTrigger = DialogPrimitive.Trigger;
const OverlayClose = DialogPrimitive.Close;

const OverlayContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    variant?: OverlayVariant;
    title: string;
    description?: string;
    hideHeader?: boolean;
    showClose?: boolean;
  }
>(
  (
    {
      className,
      children,
      variant = "center",
      title,
      description,
      hideHeader = false,
      showClose = true,
      ...props
    },
    ref,
  ) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-graphite/45 backdrop-blur-[2px] duration-[180ms] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 border-walnut/12 bg-ivory p-5 shadow-[0_24px_60px_-24px_rgba(74,51,37,0.45)]",
          "duration-[240ms] ease-out-soft data-[state=closed]:animate-out data-[state=open]:animate-in",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "focus:outline-none",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        <div className={cn(hideHeader && "sr-only")}>
          <DialogPrimitive.Title className="font-display text-xl font-semibold text-graphite">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-sm text-graphite/70">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-graphite/50 transition-colors hover:bg-parchment hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
OverlayContent.displayName = "OverlayContent";

export { Overlay, OverlayTrigger, OverlayClose, OverlayContent };
