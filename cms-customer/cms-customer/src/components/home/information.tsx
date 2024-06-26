"use client";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { motion } from "framer-motion";
import { CarouselPlugin } from "../ui/carouselPlugin";

const FAQS = [
  {
    title: "1. Vị trí phong thủy độc tôn",
    desc: "Được bao quanh bởi 50 ngôi chùa, thiền viện, giáo sứ lớn, có lịch sử trăm năm tạo nên một vị thế phong thủy độc tôn không nghĩa trang nào có được.",
  },
  {
    title: "2. Cơ sở vật chất hiện đại",
    desc: "Đầy đủ các dịch vụ tiện ích của hoa viên nghĩa trang cao cấp: Đền trình, Nhà tang lễ, Tịnh xá, Khu lưu trữ tro cốt...",
  },
  {
    title: "3. Dịch vụ chăm sóc khách hàng 24/7",
    desc: "Đầy đủ các dịch vụ tiện ích của hoa viên nghĩa trang cao cấp: Đền trình, Nhà tang lễ, Tịnh xá, Khu lưu trữ tro cốt...",
  },
  {
    title: "4. Sứ mệnh của Bình An Viên?",
    desc: 'Bình An Viên mang sứ mệnh lưu giữ và kế thừa, tiếp nối ký ức và tôn vinh giá trị của người đã khuất cho thế hệ tiếp theo. Đó chính là nghĩa cử cao đẹp, phù hợp với truyền thống văn hóa "Uống nước nhớ nguồn" của người Việt Nam.',
  },
];

const revealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
    },
  }),
};

export default function Information() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-10 ">
      <motion.div
        className="w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        custom={1}
      >
        <Typography
          variant="h2"
          className="text-3xl font-bold mb-4 text-center text-zinc-50"
          color="blue-gray"
        >
          Giới thiệu tổng quan
        </Typography>
      </motion.div>

      <motion.div
        className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        custom={2}
      >
        <div className="mx-auto flex flex-col space-y-4">
          {FAQS.map(({ title, desc }, key) => (
            <motion.div key={key} variants={revealVariants} custom={key + 3}>
              <Accordion
                open={open === key + 1}
                onClick={() => handleOpen(key + 1)}
                className="border border-gray-300 rounded-lg shadow-sm"
              >
                <AccordionHeader className="text-left text-gray-900 bg-white p-4">
                  {title}
                </AccordionHeader>
                <AccordionBody className="bg-gray-50 p-4">
                  <Typography
                    color="blue-gray"
                    className="font-normal text-gray-500"
                  >
                    {desc}
                  </Typography>
                </AccordionBody>
              </Accordion>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mx-auto flex items-center justify-center h-96 w-full"
          variants={revealVariants}
          custom={7}
        >
          <CarouselPlugin />
        </motion.div>
      </motion.div>
    </div>
  );
}
