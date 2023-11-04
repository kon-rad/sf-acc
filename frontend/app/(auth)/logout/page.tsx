/* eslint-disable */
"use client";
import Link from "next/link";

import Button from "@/lib/components/ui/Button";
import Card from "@/lib/components/ui/Card";
import PageHeading from "@/lib/components/ui/PageHeading";
import { useLogout } from "./hooks/useLogout";
import { Suspense } from "react";

export default function Logout() {
  const { handleLogout, isPending } = useLogout();

  function Logout() {
    return (
      <main data-testid="logout-page">
        <section className="w-full min-h-[80vh] h-full outline-none flex flex-col gap-5 items-center justify-center p-6">
          <PageHeading title={"logout"} subtitle={"logout"} />
          <Card className="max-w-md w-full p-5 sm:p-10 text-center flex flex-col items-center gap-5">
            <h2 className="text-lg">{"are you sure"}</h2>
            <div className="flex gap-5 items-center justify-center">
              <Link href={"/"}>
                <Button variant={"primary"}>{"cancel"}</Button>
              </Link>
              <Button
                isLoading={isPending}
                variant={"danger"}
                onClick={() => handleLogout()}
                data-testid="logout-button"
              >
                {"logout"}
              </Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <Suspense fallback={"Loading..."}>
      <Logout />
    </Suspense>
  );
}
