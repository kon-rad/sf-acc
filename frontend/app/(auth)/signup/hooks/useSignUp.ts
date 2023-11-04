import { useState } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useToast } from "@/lib/hooks/useToast";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSignUp = () => {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { publish } = useToast();
  const handleSignUp = async () => {
    setIsPending(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      publish({
        variant: "danger",
        text: "error sign up",
      });
    } else {
      publish({
        variant: "success",
        text: "mail sent!",
      });
    }
    setIsPending(false);
  };

  return {
    handleSignUp,
    setEmail,
    password,
    setPassword,
    isPending,
    email,
  };
};
