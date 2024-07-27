import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import { StateProvider } from "@/context/StateContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import CallHotline from "@/components/home/call-hotline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme";

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
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" autoClose={5000} />{" "}
            <StateProvider>
              <CartProvider>
                <Header />
                {children}
                <Footer />
                <CallHotline />
              </CartProvider>
            </StateProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
