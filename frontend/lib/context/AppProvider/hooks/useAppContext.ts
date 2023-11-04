import { useContext } from "react";

import { AppContext } from "../app-provider";
import { BrainContextType } from "../types";

export const useAppContext = (): BrainContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
};
