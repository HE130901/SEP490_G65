import { ThemeProvider } from "../components/theme-provider";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { StateProvider } from "@/context/state-context";
import type { Metadata } from "next";
import "./globals.css";

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
