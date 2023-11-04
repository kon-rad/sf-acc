/* eslint-disable max-lines */
import { useState } from "react";

// import { useToast } from "@/lib/hooks";

export const useAppProvider = () => {
  // const { publish } = useToast();
  const [appState, setAppState] = useState<any>({});

  return {
    appState,
    setAppState,
  };
};
