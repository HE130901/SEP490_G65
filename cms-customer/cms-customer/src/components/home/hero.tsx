"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          src="/images/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full object-cover"
        />
      </motion.div>

      {/* Lớp phủ mờ */}
      <div className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"></div>

      {/* Nội dung */}
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-8">
        <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
          {/* Lớp nền trong suốt */}
          <motion.div
            className="flex flex-col items-center rounded-lg p-8 md:p-12 bg-white/10 backdrop-blur-md shadow-lg max-w-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Image
                alt="ABV"
                src="/images/logo.png"
                height={150}
                width={400}
                className="rounded-lg"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4 mb-4 w-full text-white text-lg leading-snug tracking-wide text-shadow-md"
            >
              <span className="font-bold text-white">
                &quot;Nơi an nghỉ cuối cùng
                <br /> bình yên và trang trọng&quot;
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-2 mb-8 w-full  text-base leading-relaxed tracking-wide text-shadow-md text-gray-300"
            >
              Con người ai cũng phải trải qua sinh-lão-bệnh-tử. <br /> An Bình
              Viên được xây nên không những là điểm đến cuối cùng của một đời
              người mà còn là nơi khởi đầu của một cuộc sống tốt đẹp hơn.
            </motion.p>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <Link href="/about">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.3)",
                  }}
                  transition={{ duration: 0.2 }}
                  className="rounded-md px-8 py-4 text-sm md:text-base lg:text-lg shadow-lg bg-gradient-to-b from-orange-200 to-orange-600 text-white"
                >
                  <p className="font-bold">Xem chi tiết</p>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
