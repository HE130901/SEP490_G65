import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An Bình Viên - Khách hàng",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};

const VisitRegistration: React.FC = ({ children }) => {
  return <div>{children}</div>;
};

export default VisitRegistration;
