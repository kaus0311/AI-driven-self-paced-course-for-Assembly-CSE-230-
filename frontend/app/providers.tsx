"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./login/hooks/useAuth";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
