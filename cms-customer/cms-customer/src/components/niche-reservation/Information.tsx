"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/ui/carouselExtension";
import Image from "next/image";

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
    },
  }),
};

export default function Component() {
  const images = [
    "/images/bg5.jpg",
    "/images/image.png",
    "/images/visit13.jpg",
    "/images/tower.webp",
  ];

  return (
    <section className="w-full pt-4">
      <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-2">
        <motion.div
          className="space-y-3 mr-16  "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <motion.h2
            className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl justify-center text-center pt-4"
            variants={revealVariants}
            custom={2}
          >
            Tháp đôi An Bình Viên
          </motion.h2>
          <motion.p
            className="max-w-[700px]  md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-black"
            variants={revealVariants}
            custom={3}
          >
            An Lạc và An Viên là hai tòa tháp được xây dựng với kiến trúc trang
            trọng và không gian yên tĩnh để lưu trữ tro cốt của những người đã
            khuất. <br /> Mỗi toà tháp gồm 7 tầng, các tầng được chia làm 8 khu
            riêng biệt. <br />
            Cả hai toà tháp đều là những lựa chọn tốt cho việc lưu trữ tro cốt
            người thân. Tùy theo sở thích và điều kiện, gia đình có thể lựa chọn
            nơi phù hợp để tưởng nhớ và tri ân người đã khuất.
          </motion.p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={4}
        >
          <Carousel orientation="vertical" className="flex items-center gap-2">
            <motion.div
              className="relative w-full"
              variants={revealVariants}
              custom={5}
            >
              <CarouselMainContainer className="h-72">
                {images.map((src, index) => (
                  <SliderMainItem
                    key={index}
                    className="border border-muted flex items-center justify-center h-72 rounded-md"
                  >
                    <Image
                      src={src}
                      alt={`Slide ${index + 1}`}
                      width={800}
                      height={800}
                      className="h-full w-full object-cover rounded-md"
                      priority={index === 0 || src === "/images/visit13.jpg"}
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
            </motion.div>
            <motion.div
              className="h-48 basis-1/4"
              variants={revealVariants}
              custom={6}
            >
              <CarouselThumbsContainer className="h-48 basis-1/4">
                {images.map((src, index) => (
                  <SliderThumbItem
                    key={index}
                    index={index}
                    className="rounded-md bg-transparent"
                  >
                    <Image
                      src={src}
                      alt={`Thumb ${index + 1}`}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover rounded-md cursor-pointer bg-background"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </SliderThumbItem>
                ))}
              </CarouselThumbsContainer>
            </motion.div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
