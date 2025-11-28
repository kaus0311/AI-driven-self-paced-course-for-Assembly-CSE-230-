// frontend/app/login/components/ui/card.tsx
"use client";

import * as React from "react";

export const Card = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      "rounded-lg border bg-card text-card-foreground p-4 shadow-sm " +
      className
    }
    {...props}
  />
);

export const CardHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={"mb-4 " + className} {...props} />
);

export const CardTitle = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={"text-xl font-semibold " + className} {...props} />
);

export const CardDescription = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={"text-sm text-muted-foreground " + className} {...props} />
);

export const CardContent = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);
