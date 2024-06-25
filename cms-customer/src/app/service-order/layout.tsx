//src/app/service-order/layout.tsx
import React from "react";

import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Sản phẩm & Dịch vụ",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};
interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
