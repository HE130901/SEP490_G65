import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn đặt chỗ",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
