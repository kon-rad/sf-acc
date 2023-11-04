import { Source_Sans_3 } from "next/font/google";
import { cookies, headers } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { AppProvider } from "@/lib/context/AppProvider";
import { SupabaseProvider } from "@/lib/context/SupabaseProvider";

import { App } from "./App";
import "./globals.css";

const sourceSans3 = Source_Sans_3({ subsets: ["latin"] });

export const metadata = {
  title: "hackathon starter",
  description: "hackathon starter - talk to yourself form the future",
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> => {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        className={`bg-white text-black min-h-screen flex flex-col dark:bg-black dark:text-white w-full ${sourceSans3.className}`}
      >
        <SupabaseProvider session={session}>
          <AppProvider>
            <App>
              <div className="flex-1">{children}</div>
            </App>
          </AppProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
