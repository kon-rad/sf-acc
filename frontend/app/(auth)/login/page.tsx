/* eslint-disable */
"use client";
import Link from "next/link";

import Button from "@/lib/components/ui/Button";
import Card from "@/lib/components/ui/Card";
import { Divider } from "@/lib/components/ui/Divider";
import Field from "@/lib/components/ui/Field";
import PageHeading from "@/lib/components/ui/PageHeading";

import { GoogleLoginButton } from "./components/GoogleLogin";
import { MagicLinkLogin } from "./components/MagicLinkLogin";
import { PasswordForgotten } from "./components/PasswordForgotten";
import { useLogin } from "./hooks/useLogin";
import { Suspense } from "react";


function Main() {
  const { handleLogin, setEmail, setPassword, email, isPending, password } =
    useLogin();
  return (
    <main>
      <section className="w-full min-h-[80vh] h-full outline-none flex flex-col gap-5 items-center justify-center p-6">
        <PageHeading title={'login'} subtitle={'login'} />
        <Card className="max-w-md w-full p-5 sm:p-10 text-left">
          <form
            data-testid="sign-in-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col gap-2"
          >
            <Field
              name="email"
              required
              type="email"
              placeholder={"email"}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Field
              name="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"password"}
            />

            <div className="flex flex-col items-center justify-center mt-2 gap-2">
              <Button type="submit" isLoading={isPending}>
                login
              </Button>
              <PasswordForgotten setEmail={setEmail} email={email} />

              <Link href="/signup">signup</Link>
            </div>

            <Divider text={"or"} />
            <div className="flex flex-col items-center justify-center mt-2 gap-2">
              <GoogleLoginButton />
            </div>
            <Divider text={"or"} />
            <MagicLinkLogin email={email} setEmail={setEmail} />
          </form>
        </Card>
      </section>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense fallback="Loading...">
      <Main />
    </Suspense>
    
  );
}
