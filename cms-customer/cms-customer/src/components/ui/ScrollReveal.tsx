// src/components/ui/ScrollReveal.tsx
"use client";

import { ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0.2,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // chỉ kích hoạt một lần
    threshold: 0.1, // phần trăm của phần tử cần vào vùng nhìn thấy để kích hoạt
  });

  if (inView) {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay },
    });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
