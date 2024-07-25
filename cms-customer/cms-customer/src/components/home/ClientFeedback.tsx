"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import Image from "next/image";
import StatsCard from "@/components/ui/stats-card";

const STATS = [
  {
    count: "1,500+",
    title: "Khách hàng",
  },
  {
    count: "15",
    title: "Năm kinh nghiệm",
  },
  {
    count: "2,300+",
    title: "Dịch vụ đã cung cấp",
  },
  {
    count: "24/7",
    title: "Chăm sóc khách hàng",
  },
];

const testimonials = [
  {
    name: "Trịnh Ngọc Mai",
    title: "TP. Thanh Hóa",
    text: "Sự tận tâm, dịch vụ tốt và chú ý đến từng chi tiết của họ thực sự đã tạo nên sự khác biệt. Tôi rất khuyến khích sử dụng dịch vụ của họ!",
    image: "/images/avatar1.jpg",
  },
  {
    name: "Nguyễn Trung Dũng",
    title: "TP. Hà Nội",
    text: "Họ hiểu nhu cầu của tôi và cung cấp một giải pháp một cách nhanh chóng. Hỗ trợ khách hàng của họ rất tuyệt vời, và tôi đánh giá cao sự cam kết của họ.",
    image: "/images/avatar2.jpg",
  },
  {
    name: "Lê Văn Cường",
    title: "TP. Hồ Chí Minh",
    text: "Họ không chỉ đáp ứng mà còn vượt qua mong đợi của tôi. Sự thành thạo và chuyên nghiệp trong công việc của họ đã giúp tôi giải quyết nhanh chóng các yêu cầu.",
    image: "/images/avatar3.jpg",
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

const ClientFeedback: FC = () => {
  return (
    <div>
      {/* Testimonials Section */}
      <motion.section
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        custom={1}
      >
        <div className="max-w-7xl mx-auto text-center px-4">
          <Typography
            variant="h4"
            className="text-4xl sm:text-5xl font-bold mb-4 text-white pb-10"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Khách hàng nói gì về chúng tôi
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={revealVariants}
                custom={index + 2}
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={200}
                  height={200}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-500"
                />
                <Typography
                  variant="h5"
                  className="text-xl font-semibold mb-2 text-gray-900"
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className="text-sm text-gray-500 mb-4"
                >
                  {testimonial.title}
                </Typography>
                <Typography variant="body1" className="text-gray-700 italic">
                  &quot;{testimonial.text}&quot;
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="mx-auto grid gap-10 px-8 py-16 lg:grid-cols-2 xl:gap-20 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        custom={4}
      >
        <motion.div
          className="flex flex-col justify-center items-center lg:items-start px-4 lg:px-8 xl:px-16"
          variants={revealVariants}
          custom={5}
        >
          <Typography
            variant="h3"
            className="text-4xl sm:text-5xl font-bold mb-4 text-white pb-10"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Các chỉ số nổi bật
          </Typography>
          <Typography
            variant="body1"
            className=" font-bold mb-4 text-white  pb-10"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Là một dự án mang ý nghĩa tâm linh và nhân văn, An Bình Viên tự hào
            cung cấp không gian an nghỉ gần gũi với thiên nhiên, thân thiện với
            môi trường và trường tồn với thời gian.
          </Typography>
        </motion.div>
        <motion.div
          className="flex justify-center lg:justify-start px-4 lg:px-8 xl:px-16"
          variants={revealVariants}
          custom={6}
        >
          <div className="grid grid-cols-2 gap-8">
            {STATS.map((props, key) => (
              <StatsCard key={key} {...props} />
            ))}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ClientFeedback;
