// frontend/app/login/components/ui/input.tsx
"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Reusable input styled to match the ASU card look:
 * - Warm beige background
 * - Dark text
 * - Slight shadow
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={
        "block w-full rounded-md border px-3 py-2 text-sm " +
        "border-[#d5bfa2] bg-[#f3e1c9] text-[#3b2f2a] " +
        "placeholder:text-[#b79a7a] shadow-sm " +
        "focus:outline-none focus:ring-2 focus:ring-[#8C1D40] focus:ring-offset-1 " +
        className
      }
      {...props}
    />
  )
);

Input.displayName = "Input";
