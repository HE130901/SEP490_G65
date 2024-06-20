"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface StateContextProps {
  user: string | null;
  setUser: (user: string) => void;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
