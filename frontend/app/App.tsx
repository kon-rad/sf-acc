"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";
import { useSupabase } from "@/lib/context/SupabaseProvider";

import { MessagesProvider } from "@/lib/hooks/useMessages";
import { GlobalStateProvider } from "@/lib/context/GlobalStateProvider";
// import { useAppContext } from "@/lib/context/AppProvider/hooks/useAppContext";

const queryClient = new QueryClient();

// This wrapper is used to make effect calls at a high level in app rendering.
export const App = ({ children }: PropsWithChildren): JSX.Element => {
  const { session } = useSupabase();

  useEffect(() => {
    // void fetchPublicPrompts();
  }, [session?.user]);

  return (
    <GlobalStateProvider>
      <MessagesProvider>
        <QueryClientProvider client={queryClient}>
          <div className="flex-1">{children}</div>
        </QueryClientProvider>
      </MessagesProvider>
    </GlobalStateProvider>
  );
};
