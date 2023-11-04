import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useToast } from "@/lib/hooks";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useLogout = () => {
  const { supabase } = useSupabase();
  const [isPending, setIsPending] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { publish } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    const { error } = await supabase.auth.signOut();
    localStorage.clear();

    if (error) {
      console.error("Error logging out:", error.message);
      publish({
        variant: "danger",
        text: "error",
      });
    } else {
      publish({
        variant: "success",
        text: "logged out",
      });
      router.replace("/");
    }
    setIsPending(false);
  };

  return {
    handleLogout,
    isPending,
  };
};
