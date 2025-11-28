// frontend/app/login/components/ui/button.tsx
"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={
        "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium " +
        "bg-primary text-primary-foreground hover:bg-primary/90 " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
      {...props}
    />
  )
);

Button.displayName = "Button";
