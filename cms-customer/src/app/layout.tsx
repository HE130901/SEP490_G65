import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { StateProvider } from "@/context/state-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

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
            <Header />
            {children}
            <Toaster />
            <Footer />
          </CartProvider>
        </StateProvider>
      </body>
    </html>
  );
}
