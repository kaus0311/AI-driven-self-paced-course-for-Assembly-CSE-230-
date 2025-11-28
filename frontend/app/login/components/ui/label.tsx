// frontend/app/login/components/ui/label.tsx
"use client";

import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Simple label: always dark, medium weight, small size.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => (
    <label
      ref={ref}
      className={
        "block text-sm font-medium text-[#3b2f2a] mb-1 " + className
      }
      {...props}
    />
  )
);

Label.displayName = "Label";
