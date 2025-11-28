// frontend/app/login/hooks/useAuth.tsx
"use client";

import { useState } from "react";

export type UserRole = "student" | "professor";

export interface AuthUser {
  email: string;
  role: UserRole;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  role?: UserRole;
}

/**
 * Simple local auth hook.
 * - Validates fields
 * - Stores user + role in local state
 * Later you can replace login() with a real backend call.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<LoginResult> => {
    if (!email || !password) {
      return { success: false, error: "Please fill in all fields." };
    }

    if (!email.endsWith("@asu.edu")) {
      return { success: false, error: "Please use your ASU email address." };
    }

    if (password.length < 4) {
      return {
        success: false,
        error: "Password must be at least 4 characters long.",
      };
    }

    setUser({ email, role });
    return { success: true, role };
  };

  const logout = () => setUser(null);

  return { user, login, logout };
}
