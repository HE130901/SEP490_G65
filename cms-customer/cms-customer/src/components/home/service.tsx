"use client";

import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function ServicesList() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 ">
      <div className="py-8 px-8 md:px-16 lg:px-24 bg-gray-100 dark:bg-gray-800">
        <section className="mb-12 text-center">
          <Typography
            variant="h4"
            className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-200"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Dịch vụ của chúng tôi
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 max-w-2xl mx-auto font-bold"
          >
            Tại đây, bạn có thể đặt các dịch vụ liên quan đến ô chứa và các dịch
            vụ khác.<br></br>
            Chúng tôi cam kết mang lại cho bạn trải nghiệm tốt nhất và trang
            trọng nhất!
          </Typography>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Đặt ô chứa",
              image: "/images/booking2.jpg",
              description:
                "Dịch vụ đặt ô chứa trực tuyến giúp việc lưu trữ tro cốt người thân trở nên dễ dàng cũng như đem lại sự an tâm và tiện lợi cho gia đình trong quá trình tưởng nhớ và tri ân người đã khuất.",
              link: "/niche-reservation",
            },
            {
              title: "Quản lý hợp đồng & ô chứa",
              image: "/images/visit.jpg",
              description:
                "Đăng nhập và quản lý các hợp đồng, ô chứa cũng như dịch vụ và thông tin cá nhân của quý khách hàng một cách nhanh chóng và thuận tiện.",
              link: "/dashboard",
            },
            {
              title: "Các dịch vụ khác",
              image: "/images/service.png",
              description:
                "Nhằm mang đến sự tiện lợi và hỗ trợ tốt nhất cho quý khách đã đặt mua ô chứa tại An Bình Viên, chúng tôi cung cấp các gói lễ theo ngày rằm, lễ tết, giỗ chạp... và các dịch vụ khác.",
              link: "/service-order",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-start space-y-2">
              <article className="relative overflow-hidden rounded-lg shadow transition hover:shadow-2xl hover:transform hover:scale-105">
                <Link href={item.link}>
                  <Image
                    alt={item.title}
                    src={item.image}
                    className="absolute inset-0 h-full w-full object-cover"
                    layout="fill"
                  />
                  <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                    <div className="p-4 sm:p-6 bg-black/60 rounded-lg">
                      <h3 className="mt-0.5 text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
