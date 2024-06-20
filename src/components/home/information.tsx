"use client";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { CarouselPlugin } from "../ui/carouselPlugin";

const FAQS = [
  {
    title: "1. Vị trí phong thủy độc tôn",
    desc: "Được bao quanh bởi 50 ngôi chùa, thiền viện, giáo sứ lớn, có lịch sử trăm năm tạo nên một vị thể phong thủy độc tôn không nghĩa trang nào có được.",
  },
  {
    title: "2. Cơ sở vật vất hiện đại",
    desc: "Đầy đủ các dịch vụ tiện ích của hoa viên nghĩa trang cao cấp: Đền trình, Nhà tang lễ, Tịnh xá, Khu lưu trữ tro cốt...",
  },
  {
    title: "3. Dich vụ chăm sóc khách hàng 24/7",
    desc: "Đầy đủ các dịch vụ tiện ích của hoa viên nghĩa trang cao cấp: Đền trình, Nhà tang lễ, Tịnh xá, Khu lưu trữ tro cốt...",
  },
  {
    title: "4. Sứ mệnh của Bình An Viên?",
    desc: 'Bình An Viên mang sứ mệnh lưu giữ và kế thừa, tiếp nối ký ức và tôn vinh giá trị của người đã khuất cho thế hệ tiếp theo. Đó chính là nghĩa cử cao đẹp, phù hợp với truyền thống văn hóa "Uống nước nhớ nguồn" của người Việt Nam."',
  },
];

export default function Information() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-10 h-auto pt-20">
      <Typography
        variant="h2"
        className="text-3xl font-semibold mb-4"
        color="blue-gray"
      >
        Giới thiệu tổng quan
      </Typography>

      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="mx-auto lg:px-20 flex flex-col">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
              className="mb-4"
            >
              <AccordionHeader className="text-left text-gray-900">
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  color="blue-gray"
                  className="font-normal text-gray-500"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
        <div className="mx-auto lg:px-20 h-96 flex items-center">
          <CarouselPlugin />
        </div>
      </div>
    </section>
  );
}
