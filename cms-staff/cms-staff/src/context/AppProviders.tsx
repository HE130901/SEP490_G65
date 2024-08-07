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
import { DashboardProvider } from "./DashboardContext";
import { PendingOrdersProvider } from "./PendingOrdersContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PendingOrdersProvider>
        <ContractProvider>
          <CustomerProvider>
            <ServiceProvider>
              <NicheProvider>
                <NicheReservationProvider>
                  <VisitRegistrationProvider>
                    <ServiceOrderProvider>
                      <DashboardProvider>{children}</DashboardProvider>
                    </ServiceOrderProvider>
                  </VisitRegistrationProvider>
                </NicheReservationProvider>
              </NicheProvider>
            </ServiceProvider>
          </CustomerProvider>
        </ContractProvider>
      </PendingOrdersProvider>
    </AuthProvider>
  );
}
