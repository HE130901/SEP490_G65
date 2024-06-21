import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt ô chứa",
  description: "Nơi an nghỉ cuối cùng, bình yên và trang trọng",
};

const NicheResLayout: React.FC = ({ children }) => {
  return <div>{children}</div>;
};

export default NicheResLayout;
