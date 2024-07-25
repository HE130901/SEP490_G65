"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen pt-18">
      <main className="flex-1">
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-300 to-primary/80 text-primary-foreground bg-red-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-6"
                variants={revealVariants}
                custom={2}
              >
                <div className="space-y-4">
                  <Typography
                    variant="h1"
                    className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl text-primary-foreground"
                  >
                    An Bình Viên <br /> Tiên phong trong dịch vụ lưu trữ tro cốt
                  </Typography>
                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-primary-foreground"
                  >
                    <br />
                    Chúng tôi cung cấp các dịch vụ tiên tiến và chuyên nghiệp
                    nhằm đáp ứng mọi nhu cầu của khách hàng.
                  </Typography>
                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-primary-foreground"
                  >
                    Với kinh nghiệm lâu năm trong lĩnh vực dịch vụ tang lễ,
                    chúng tôi cam kết cung cấp những giải pháp tốt nhất, từ quản
                    lý cơ sở dữ liệu tro cốt đến chăm sóc và bảo dưỡng nhà chứa.
                  </Typography>
                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-primary-foreground"
                  >
                    Chúng tôi tự hào được đồng hành cùng hàng nghìn gia đình,
                    cung cấp nơi lưu giữ tro cốt an toàn, trang trọng và lâu
                    dài, góp phần gìn giữ ký ức và tôn vinh giá trị của người đã
                    khuất.
                  </Typography>
                </div>
              </motion.div>
              <motion.div
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                variants={revealVariants}
                custom={3}
              >
                <Image
                  src="/images/event1.jpg"
                  width={550}
                  height={550}
                  alt="Hero"
                  className="rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full py-12 md:py-24  bg-muted"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={4}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="space-y-4"
                variants={revealVariants}
                custom={5}
              >
                <div className="inline-block rounded-lg bg-slate-400 px-3 py-1 text-sm text-white">
                  Lịch sử
                </div>
                <Typography
                  variant="h2"
                  className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-800"
                >
                  20 năm phát triển dịch vụ tang lễ
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Chúng tôi bắt đầu với sứ mệnh cung cấp dịch vụ quản lý nhà
                  chứa tro cốt chất lượng cao. Trải qua 20 năm, chúng tôi đã
                  không ngừng cải tiến và phát triển để mang đến dịch vụ tốt
                  nhất cho khách hàng.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi đã vượt qua
                  nhiều thách thức để trở thành đơn vị tiên phong trong lĩnh vực
                  quản lý nhà chứa tro cốt.
                </Typography>
              </motion.div>
              <motion.div
                className="space-y-4"
                variants={revealVariants}
                custom={6}
              >
                <div className="inline-block rounded-lg bg-slate-400 px-3 py-1 text-sm text-white">
                  Sứ mệnh
                </div>
                <Typography
                  variant="h2"
                  className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-800"
                >
                  Bảo quản tro cốt một cách an toàn và trang trọng
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Chúng tôi cam kết cung cấp các giải pháp quản lý nhà chứa tro
                  cốt an toàn, giúp các gia đình lưu giữ ký ức về người thân một
                  cách trang trọng và lâu dài.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  Với sự tận tâm và chuyên nghiệp, chúng tôi luôn nỗ lực mang
                  đến những dịch vụ tốt nhất, giúp khách hàng an tâm về nơi an
                  nghỉ cuối cùng của người thân.
                </Typography>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-300 to-primary/80"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={7}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="space-y-4"
                variants={revealVariants}
                custom={8}
              >
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Đội ngũ
                </div>
                <Typography
                  variant="h2"
                  className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary-foreground"
                >
                  Những chuyên gia hàng đầu
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-primary-foreground"
                >
                  Đội ngũ của chúng tôi bao gồm những chuyên gia hàng đầu trong
                  lĩnh vực quản lý nhà chứa tro cốt, với kinh nghiệm và chuyên
                  môn sâu rộng. Họ là những người dẫn đầu trong việc phát triển
                  các giải pháp lưu trữ và quản lý tro cốt tiên tiến.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-primary-foreground"
                >
                  Với sự đam mê và tận tâm, chúng tôi luôn nỗ lực để mang đến
                  những giải pháp tốt nhất, đáp ứng nhu cầu lưu giữ tro cốt của
                  khách hàng.
                </Typography>
              </motion.div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    name: "Trần Thanh",
                    role: "CEO",
                    description:
                      "Với hơn 15 năm kinh nghiệm trong lĩnh vực quản lý nhà chứa tro cốt, Trần Thanh đã dẫn dắt dự án trở thành một trong những đơn vị hàng đầu.",
                    image: "/images/avatar1.jpg",
                    fallback: "TT",
                  },
                  {
                    name: "Hoàng Trang",
                    role: "CTO",
                    description:
                      "Hoàng Trang là một chuyên gia công nghệ hàng đầu, với nhiều năm kinh nghiệm trong việc phát triển và triển khai các giải pháp quản lý tro cốt tiên tiến.",
                    image: "/images/avatar2.jpg",
                    fallback: "HT",
                  },
                  {
                    name: "Đặng Lâm",
                    role: "VP of Engineering",
                    description:
                      "Đặng Lâm là một kỹ sư tài năng, với nhiều năm kinh nghiệm trong việc xây dựng và quản lý các hệ thống quản lý tro cốt.",
                    image: "/images/avatar3.jpg",
                    fallback: "DL",
                  },
                  {
                    name: "Lê Hằng",
                    role: "Head of Product",
                    description:
                      "Lê Hằng là một chuyên gia sản phẩm với nhiều năm kinh nghiệm trong việc phát triển và quản lý các sản phẩm liên quan đến dịch vụ tro cốt.",
                    image: "/images/avatar4.jpg",
                    fallback: "LH",
                  },
                ].map((member, index) => (
                  <motion.div
                    className="flex flex-col items-start space-y-2"
                    key={index}
                    variants={revealVariants}
                    custom={9 + index}
                  >
                    <Avatar>
                      <AvatarImage src={member.image} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Typography
                        variant="h6"
                        className="text-lg font-bold text-primary-foreground"
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className="text-primary-foreground"
                      >
                        {member.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-primary-foreground"
                      >
                        {member.description}
                      </Typography>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
