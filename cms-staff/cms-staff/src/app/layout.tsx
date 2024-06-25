import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <main>{children}</main>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
