"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { motion } from "framer-motion";

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
    desc: "Với nhiều năm kinh nghiệm trong ngành, chúng tôi luôn sẵn sàng hỗ trợ quý khách 24/7.",
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
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Information() {
  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <Typography
            variant="h4"
            className="text-4xl sm:text-5xl font-bold mb-4 text-white"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Khám phá những điểm nổi bật <br />
            và giá trị cốt lõi của An Bình Viên
          </Typography>
          <Typography
            variant="subtitle1"
            className="text-gray-200 max-w-2xl mx-auto"
          >
            Nghĩa trang An Bình Viên tọa lạc tại vị trí yên bình, giữa thiên
            nhiên tươi đẹp, là nơi lưu giữ những ký ức, tình yêu và sự kính
            trọng của chúng ta dành cho những người thân yêu đã khuất. Với thiết
            kế hài hòa và không gian thanh tịnh, An Bình Viên mang đến cho quý
            khách một nơi an nghỉ vĩnh hằng đầy ấm áp và trang nghiêm.
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="w-full rounded-lg overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center "
            variants={revealVariants}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card>
              <CardMedia
                component="img"
                alt="An Binh Vien"
                height="300"
                image="/images/ABV1.png"
                title="An Binh Vien"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Tại sao chọn An Bình Viên?
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-4 justify-center justify-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            custom={2}
          >
            {FAQS.map(({ title, desc }, key) => (
              <motion.div key={key} variants={revealVariants} custom={key + 3}>
                <Accordion
                  expanded={expanded === key}
                  onChange={handleChange(key)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${key}bh-content`}
                    id={`panel${key}bh-header`}
                  >
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="textSecondary">{desc}</Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Box>
  );
}
