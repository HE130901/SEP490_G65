"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";
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
    name: "Jessica Devis",
    title: "CEO @ Marketing Digital Ltd.",
    text: "Đây đã là một bước ngoặt cho doanh nghiệp của tôi. Sự tận tâm, chuyên môn và chú ý đến từng chi tiết của họ thực sự đã tạo nên sự khác biệt. Tôi rất khuyến khích sử dụng dịch vụ của họ!",
    image: "/images/avatar1.jpg",
  },
  {
    name: "Mary Joshiash",
    title: "Marketing @ Apple Inc.",
    text: "Họ hiểu nhu cầu độc đáo của tôi và cung cấp một giải pháp tùy chỉnh một cách nhanh chóng. Hỗ trợ khách hàng của họ rất tuyệt vời, và tôi đánh giá cao sự cam kết của họ.",
    image: "/images/avatar2.jpg",
  },
  {
    name: "Marcell Glock",
    title: "CFO @ Apple Inc.",
    text: "Họ không chỉ đáp ứng mà còn vượt qua mong đợi của chúng tôi. Phương pháp tiếp cận sáng tạo và sự thành thạo kỹ thuật của họ đã đóng vai trò quan trọng trong thành công của chúng tôi.",
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
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        custom={1}
      >
        <div className="max-w-7xl mx-auto text-center px-4">
          <Typography
            variant="h2"
            className="text-3xl font-semibold mb-6 text-blue-gray-900"
          >
            Khách hàng nói gì về chúng tôi
          </Typography>
          <Typography
            variant="lead"
            className="text-lg mb-12 text-gray-600 mx-auto max-w-2xl"
          >
            Khám phá những gì khách hàng của chúng tôi nói về trải nghiệm của họ
            với dịch vụ của chúng tôi. <br />
            Chúng tôi tự hào mang lại kết quả xuất sắc và xây dựng các mối quan
            hệ đối tác lâu dài.
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
                  width={100}
                  height={100}
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
        className="mx-auto grid gap-10 px-8 py-16 lg:grid-cols-2 xl:gap-20 bg-gray-50"
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
            variant="h2"
            className="text-3xl font-semibold mb-6 text-center lg:text-left text-blue-gray-900"
          >
            Các chỉ số nổi bật
          </Typography>
          <Typography
            variant="lead"
            className="text-center lg:text-left text-gray-700"
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