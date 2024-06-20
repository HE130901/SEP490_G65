"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import videoSrc from "@/assets/videos/video.mp4";

function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Lớp phủ mờ */}
      <div className="absolute inset-0 h-full w-full bg-black/40"></div>

      {/* Nội dung */}
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-start text-left">
          {/* Lớp nền trong suốt */}
          <motion.div
            className="flex flex-col items-center rounded-lg p-8 md:p-12 bg-white/20 backdrop-blur-sm shadow-lg max-w-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Image
              alt="ABV"
              src={logo}
              height={150}
              width={200}
              className="rounded-lg"
            />
            <motion.p className="mt-4 mb-4 w-full text-white text-lg leading-snug tracking-wide text-shadow-md items-center text-center">
              <span className="font-bold">
                &quot;Nơi an nghỉ cuối cùng
                <br /> bình yên và trang trọng&quot;
              </span>
            </motion.p>
            <motion.p className="mt-2 mb-8 w-full text-white text-base leading-relaxed tracking-wide text-shadow-md">
              Con người ai cũng phải trải qua sinh-lão-bệnh-tử. Khi nhân duyên
              không còn đủ đầy, chúng ta trở về với đất mẹ. Nhưng cái chết không
              là dấu chấm hết của một đời người, cuộc sống của chúng ta vẫn còn
              tiếp diễn trong lòng những người thương yêu và những thế hệ sau
              nữa. <br /> An Bình Viên được xây nên không như là điểm đến cuối
              cùng của một đời người mà là điểm khởi đầu của một cuộc sống tốt
              đẹp hơn và để ghi nhớ một cuộc đời đã được sống vẹn tròn.
            </motion.p>

            <motion.div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="secondary"
                  className="shadow-lg hover:shadow-xl px-8 py-4 text-sm md:text-base lg:text-lg"
                  size="lg"
                >
                  Xem chi tiết
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="destructive"
                  className="shadow-lg hover:shadow-xl px-8 py-4 text-sm md:text-base lg:text-lg"
                  size="lg"
                >
                  Đăng ký ngay
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
