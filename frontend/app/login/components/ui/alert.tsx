// frontend/app/login/components/ui/alert.tsx
"use client";

import * as React from "react";

type AlertVariant = "default" | "destructive";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export const Alert = ({
  variant = "default",
  className = "",
  ...props
}: AlertProps) => {
  const base =
    "flex items-start gap-2 rounded-md border px-3 py-2 text-sm " + className;

  const styles =
    variant === "destructive"
      ? "border-red-500 bg-red-50 text-red-700"
      : "border-border bg-muted text-foreground";

  return <div className={base + " " + styles} {...props} />;
};

export const AlertDescription = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={"text-sm " + className} {...props} />
);
