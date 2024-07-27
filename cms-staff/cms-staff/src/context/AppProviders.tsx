"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ContractProvider } from "./ContractContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ContractProvider>{children}</ContractProvider>
    </AuthProvider>
  );
}
