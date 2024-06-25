"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SomeOtherContextType {
  someState: string;
  setSomeState: (value: string) => void;
}

const SomeOtherContext = createContext<SomeOtherContextType | undefined>(
  undefined
);

export function SomeOtherProvider({ children }: { children: ReactNode }) {
  const [someState, setSomeState] = useState("default value");

  return (
    <SomeOtherContext.Provider value={{ someState, setSomeState }}>
      {children}
    </SomeOtherContext.Provider>
  );
}

export function useSomeOther() {
  const context = useContext(SomeOtherContext);
  if (!context) {
    throw new Error("useSomeOther must be used within a SomeOtherProvider");
  }
  return context;
}
