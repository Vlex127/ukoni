import * as React from "react"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Field Group                                */
/* -------------------------------------------------------------------------- */
const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-4", className)} {...props} />
})
FieldGroup.displayName = "FieldGroup"

/* -------------------------------------------------------------------------- */
/* Field                                   */
/* -------------------------------------------------------------------------- */
const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("grid gap-2", className)} {...props} />
})
Field.displayName = "Field"

/* -------------------------------------------------------------------------- */
/* Field Label                                */
/* -------------------------------------------------------------------------- */
const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

/* -------------------------------------------------------------------------- */
/* Field Description                             */
/* -------------------------------------------------------------------------- */
const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

/* -------------------------------------------------------------------------- */
/* Field Separator                              */
/* -------------------------------------------------------------------------- */
const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative py-2", className)} {...props}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {children}
        </span>
      </div>
    </div>
  )
})
FieldSeparator.displayName = "FieldSeparator"

export { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator }