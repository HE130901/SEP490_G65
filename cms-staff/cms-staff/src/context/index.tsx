"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { SomeOtherProvider } from "./SomeOtherContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SomeOtherProvider>{children}</SomeOtherProvider>
    </AuthProvider>
  );
}
