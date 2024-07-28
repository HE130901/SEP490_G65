// AppProviders.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ContractProvider } from "./ContractContext";
import { CustomerProvider } from "./CustomerContext";
import { NicheProvider } from "./NicheContext";
import { ServiceProvider } from "./ServiceContext";
import { NicheReservationProvider } from "./NicheReservationContext";
import { VisitRegistrationProvider } from "./VisitRegistrationContext";
import { ServiceOrderProvider } from "./ServiceOrderContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ContractProvider>
        <CustomerProvider>
          <ServiceProvider>
            <NicheProvider>
              <NicheReservationProvider>
                <VisitRegistrationProvider>
                  <ServiceOrderProvider>{children}</ServiceOrderProvider>
                </VisitRegistrationProvider>
              </NicheReservationProvider>
            </NicheProvider>
          </ServiceProvider>
        </CustomerProvider>
      </ContractProvider>
    </AuthProvider>
  );
}
