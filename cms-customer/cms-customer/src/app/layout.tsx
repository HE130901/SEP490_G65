import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { StateProvider } from "@/context/StateContext";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import CallHotline from "@/components/home/call-hotline";
import { ToastContainer } from "react-toastify";

export const metadata = {
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
          <CartProvider>
            <Header currentView={undefined} setCurrentView={undefined} />
            {children}
            <Toaster />
            <ToastContainer position="bottom-right" />
            <Footer />
            <CallHotline />
          </CartProvider>
        </StateProvider>
      </body>
    </html>
  );
}
