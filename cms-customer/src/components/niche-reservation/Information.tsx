"use client";

import React from "react";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/ui/carouselExtension";
import Image from "next/image";

export default function Component() {
  const images = [
    "/images/121212.jpg",
    "/images/tower.webp",
    "/images/visit13.jpg",
    "/images/image.png",
  ];

  return (
    <section className="w-full pt-4">
      <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-2">
        <div>
          <div className="space-y-3 mr-16">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Tháp đôi An Bình Viên
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              An Viên và An Bình là hai tòa tháp được xây dựng với kiến trúc trang trọng và không gian yên tĩnh để lưu trữ tro cốt của những người đã khuất. <br /> Mỗi toà tháp gồm 7 tầng, các tầng được chia làm 8 khu riêng biệt. <br />Cả hai toà tháp đều là những lựa chọn tốt cho việc lưu trữ tro cốt người thân. Tùy theo sở thích và điều kiện, gia đình có thể lựa chọn nơi phù hợp để tưởng nhớ và tri ân người đã khuất.
            </p>
          </div>
        </div>
        <div>
          <Carousel orientation="vertical" className="flex items-center gap-2">
            <div className="relative w-full">
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
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
            </div>
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
                  />
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
