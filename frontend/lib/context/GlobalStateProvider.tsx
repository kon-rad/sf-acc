import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext<any>();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState<string | null>(null);

  return (
    <GlobalStateContext.Provider
      value={
        {
          globalState,
          setGlobalState,
        } as any
      }
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
