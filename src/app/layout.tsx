import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/components/blog-header";
import { SyncUser } from "~/components/sync-user";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mi-Blog",
  description: "A blog of Mi group :)",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ViewTransitions>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body>
            <TRPCReactProvider>
              <HydrateClient>
                <Header />
                <main className="container mx-auto px-4 py-8">{children}</main>
                <Toaster />
                <SyncUser />
              </HydrateClient>
            </TRPCReactProvider>
          </body>
        </html>
      </ViewTransitions>
    </ClerkProvider>
  );
}
