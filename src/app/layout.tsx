import { ThemeProvider } from "@/components/theme-provider";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import CallHotline from "@/components/home/call-hotline";
import { Toaster } from "@/components/ui/sonner";
import { StateProvider } from "@/context/state-context";
import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StateProvider>
            <Header />

            {children}
            <Footer />
          </StateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
