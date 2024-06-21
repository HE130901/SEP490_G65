import React from 'react';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An Bình Viên - Đăng nhập",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};
interface LayoutProps {
    children: React.ReactNode;
    // Define any other props you need for your layout component
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // Add your layout logic here

    return (
        <div>
            {/* Add your layout components here */}
            {children}
        </div>
    );
};

export default Layout;