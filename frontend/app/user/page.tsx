/* eslint-disable */
"use client";
import { useEffect } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

const UserPage = (): JSX.Element => {
  const { session } = useSupabase();

  if (session === null) {
    redirectToLogin();
  }

  useEffect(() => {
    console.log("user logged in ");
  }, [session.access_token]);

  return (
    <>
      <main className="w-full flex flex-col pt-10">
        <section className="flex flex-col justify-center items-center flex-1 gap-5 h-full">
          hello user page
        </section>
      </main>
    </>
  );
};

export default UserPage;
