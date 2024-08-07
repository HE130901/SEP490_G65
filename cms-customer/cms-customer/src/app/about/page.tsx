"use client";

import Image from "next/image";
import Typography from "@mui/material/Typography";
import { Avatar } from "@mui/material";
import { motion } from "framer-motion";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-gradient-to-r from-orange-300 to-orange-200">
      <main className="flex-1">
        <section className="w-full text-gray-800">
          <div className="container mx-auto py-10 px-4">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Typography variant="h2" fontWeight={700} color={"black"}>
                    An Bình Viên
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    fontStyle={"italic"}
                    className="text-xl font-bold tracking-tighter text-gray-800"
                  >
                    Tiên phong trong dịch vụ lưu trữ tro cốt
                  </Typography>

                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-gray-800"
                  >
                    <br />
                    Chúng tôi cung cấp các dịch vụ tiên tiến và chuyên nghiệp
                    nhằm đáp ứng mọi nhu cầu của khách hàng.
                  </Typography>
                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-gray-800"
                  >
                    Với kinh nghiệm lâu năm trong lĩnh vực dịch vụ tang lễ,
                    chúng tôi cam kết cung cấp những giải pháp tốt nhất, từ quản
                    lý cơ sở dữ liệu tro cốt đến chăm sóc và bảo dưỡng nhà chứa.
                  </Typography>
                  <Typography
                    variant="body1"
                    className="max-w-[600px] text-lg md:text-xl text-gray-800"
                  >
                    Chúng tôi tự hào được đồng hành cùng hàng nghìn gia đình,
                    cung cấp nơi lưu giữ tro cốt an toàn, trang trọng và lâu
                    dài, góp phần gìn giữ ký ức và tôn vinh giá trị của người đã
                    khuất.
                  </Typography>
                </div>
              </div>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Image
                  src="/images/event1.jpg"
                  width={550}
                  height={550}
                  alt="Hero"
                  className="rounded-xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-slate-400 px-3 py-1 text-xl text-white font-extrabold">
                  Lịch sử
                </div>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  fontStyle={"italic"}
                  className="text-xl font-bold tracking-tighter text-gray-800"
                >
                  20 năm phát triển dịch vụ
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl"
                >
                  Chúng tôi bắt đầu với sứ mệnh cung cấp dịch vụ quản lý nhà
                  chứa tro cốt chất lượng cao. Trải qua 20 năm, chúng tôi đã
                  không ngừng cải tiến và phát triển để mang đến dịch vụ tốt
                  nhất cho khách hàng.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl"
                >
                  Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi đã vượt qua
                  nhiều thách thức để trở thành đơn vị tiên phong trong lĩnh vực
                  quản lý nhà chứa tro cốt.
                </Typography>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-slate-400 px-3 py-1 text-xl text-white font-extrabold">
                  Sứ mệnh
                </div>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  fontStyle={"italic"}
                  className="text-xl font-bold tracking-tighter text-gray-800"
                >
                  Bảo quản tro cốt trang trọng
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl"
                >
                  Chúng tôi cam kết cung cấp các giải pháp quản lý nhà chứa tro
                  cốt an toàn, giúp các gia đình lưu giữ ký ức về người thân một
                  cách trang trọng và lâu dài.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] text-muted-foreground md:text-xl lg:text-base xl:text-xl"
                >
                  Với sự tận tâm và chuyên nghiệp, chúng tôi luôn nỗ lực mang
                  đến những dịch vụ tốt nhất, giúp khách hàng an tâm về nơi an
                  nghỉ cuối cùng của người thân.
                </Typography>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-300 to-orange-200">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-slate-400 px-3 py-1 text-xl text-white font-extrabold">
                  Đội ngũ
                </div>

                <Typography
                  variant="h3"
                  fontWeight={700}
                  fontStyle={"italic"}
                  className="text-xl font-bold tracking-tighter text-gray-800"
                >
                  Những chuyên gia hàng đầu
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] md:text-xl lg:text-base xl:text-xl text-gray-800"
                >
                  Đội ngũ của chúng tôi bao gồm những chuyên gia hàng đầu trong
                  lĩnh vực quản lý nhà chứa tro cốt, với kinh nghiệm và chuyên
                  môn sâu rộng. Họ là những người dẫn đầu trong việc phát triển
                  các giải pháp lưu trữ và quản lý tro cốt tiên tiến.
                </Typography>
                <Typography
                  variant="body1"
                  className="max-w-[700px] md:text-xl lg:text-base xl:text-xl text-gray-800"
                >
                  Với sự đam mê và tận tâm, chúng tôi luôn nỗ lực để mang đến
                  những giải pháp tốt nhất, đáp ứng nhu cầu lưu giữ tro cốt của
                  khách hàng.
                </Typography>
              </div>
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Avatar src={member.image} alt={member.name} />
                    <div>
                      <Typography
                        variant="h6"
                        className="text-lg font-bold text-gray-800"
                      >
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle2" className="text-gray-800">
                        {member.role}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {member.description}
                      </Typography>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
