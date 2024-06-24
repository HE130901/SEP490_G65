import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { StateProvider } from "@/context/state-context";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "An Bình Viên",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <StateProvider>
          <Header />
          {children}
          <Toaster />
          <Footer />
        </StateProvider>
      </body>
    </html>
  );
}
