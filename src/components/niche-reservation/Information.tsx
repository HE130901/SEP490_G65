"use client"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export default function Component() {
  return (
    <section className="w-full pt-4  ">
      <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-2">
        <div>
          <div className="space-y-3 mr-16">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">Tháp đôi An Bình Viên</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
            An Viên và An Bình là hai tòa tháp được xây dựng với kiến trúc trang trọng và không gian yên tĩnh để lưu trữ tro cốt của những người đã khuất. <br/> Mỗi toà tháp gồm 7 tầng, các tầng được chia làm 8 khu riêng biệt. <br/>Cả hai toà tháp đều là những lựa chọn tốt cho việc lưu trữ tro cốt người thân. Tùy theo sở thích và điều kiện, gia đình có thể lựa chọn nơi phù hợp để tưởng nhớ và tri ân người đã khuất. 
            </p>
          </div>
        </div>
        <div>
          <Carousel className="w-full max-w-md ml-16" autoSlide>
            <CarouselContent>
              <CarouselItem>
                <img
                  src="/images/event1.jpg"
                  width={450}
                  height={300}
                  alt="An Viên"
                  className="aspect-[3/2] rounded-xl object-cover"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="/images/tower.webp"
                  width={450}
                  height={300}
                  alt="An Bình"
                  className="aspect-[3/2] rounded-xl object-cover"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="/images/tower.webp"
                  width={450}
                  height={300}
                  alt="Aerial View"
                  className="aspect-[3/2] rounded-xl object-cover"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>       
      </div>
    </section>
  )
}