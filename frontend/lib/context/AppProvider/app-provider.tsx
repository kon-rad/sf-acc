"use client";

import { createContext } from "react";

import { useAppProvider } from "./hooks/useAppProvider";
import { BrainContextType } from "./types";

export const AppContext = createContext<BrainContextType | undefined>(
  undefined
);

export const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const appProviderUtils = useAppProvider();

  return (
    <AppContext.Provider value={appProviderUtils}>
      {children}
    </AppContext.Provider>
  );
};
