import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cập nhật mật khẩu",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};
interface LayoutProps {
  children: React.ReactNode;
  // Define any other props you need for your layout component
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Add your layout logic here

  return <div>{children}</div>;
};

export default Layout;
