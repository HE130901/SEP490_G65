"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const Information = () => {
  return (
    <div className="flex flex-col md:flex-row px-4 md:px-10 lg:px-20 xl:px-32 2xl:px-44 gap-1">
      <div className="p-4 w-full md:w-1/3 pt-8">
        {/* Description Section */}
        <div className="flex-1 p-4 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-4">
          <h2 className="text-xl font-semibold mb-2">Tòa nhà An Lạc</h2>
          <p className="mb-4">
            Tòa nhà An Lạc là nơi an nghỉ thanh tịnh và trang trọng dành cho
            những người đã khuất.
            <br /> Với lối kiến trúc hiện đại kết hợp hài hòa với không gian
            xanh mát, tòa nhà mang đến cảm giác bình yên và ấm áp cho mỗi khách
            viếng thăm.
          </p>
          <Button className="bg-gray-500 text-white hover:bg-gray-600">
            Xem thêm
          </Button>
        </div>
      </div>
      <div className="p-4 w-full md:w-1/3 flex justify-center items-center">
        {/* Images Section */}
        <div className="relative w-80 h-80">
          <Image
            src="/images/sample1.png" // Correct path
            alt="An Lac Building"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
      <div className="p-4 w-full md:w-1/3 flex justify-center items-center">
        {/* Images Section */}
        <div className="relative w-80 h-80">
          <Image
             src="/images/sample2.png" // Correct path
            alt="Tầng 1"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
      
    </div>
  );
};

export default Information;
