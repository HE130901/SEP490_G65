"use client";

import Image from "next/image";
import Link from "next/link";

export default function EnhancedComponent() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <section className="py-12 px-8 md:px-16 lg:px-24 bg-gray-100 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Đặt ô chứa",
              image: "/images/booking2.jpg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque dignissimos. Molestias explicabo corporis voluptatem?",
              link: "/dashboard/niche-reservation",
            },
            {
              title: "Đăng ký viếng thăm",
              image: "/images/visit.jpg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque dignissimos. Molestias explicabo corporis voluptatem?",
              link: "/dashboard/visit-registration",
            },
            {
              title: "Đặt các dịch vụ khác",
              image: "/images/service.png",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque dignissimos. Molestias explicabo corporis voluptatem?",
              link: "/dashboard/service-order",
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
      </section>
    </div>
  );
}
