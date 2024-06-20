import { Typography } from "@material-tailwind/react";
import StatsCard from "@/components/ui/stats-card";
import { FC } from "react";
import Image from "next/image";
import CustomerPic1 from "@/assets/images/avatar1.jpg";
import CustomerPic2 from "@/assets/images/avatar2.jpg";
import CustomerPic3 from "@/assets/images/avatar3.jpg";

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
    text: "It has been a game-changer for my business. Their dedication, expertise, and attention to detail have truly set them apart. I highly recommend their services!",
    image: CustomerPic1,
  },
  {
    name: "Mary Joshiash",
    title: "Marketing @ Apple Inc.",
    text: "It understood my unique needs and delivered a tailored solution promptly. Their customer support is top-notch, and I appreciate their commitment.",
    image: CustomerPic2,
  },
  {
    name: "Marcell Glock",
    title: "CFO @ Apple Inc.",
    text: "They not only met but exceeded our expectations. Their innovative approach and technical proficiency have been instrumental in our success.",
    image: CustomerPic3,
  },
];

const ClientFeedback: FC = () => {
  return (
    <div>
      <section className="mx-auto grid gap-10 px-8 py-16 lg:grid-cols-2 xl:gap-20 xl:justify-items-center bg-gray-50">
        <div className="flex flex-col justify-center items-center lg:items-start pl-48">
          <Typography
            variant="h2"
            className="text-3xl font-semibold mb-6 text-center lg:text-left text-blue-gray-900"
          >
            Các chỉ số nổi bật
          </Typography>
          <Typography
            variant="lead"
            className="w-full text-center lg:text-left text-gray-700"
          >
            Là dự án mang ý nghĩa tâm linh, đậm tính nhân văn và khác biệt hoàn
            toàn so với những nghĩa trang trước đây. An Bình Viên tự hào là
            không gian an nghỉ gần gũi với thiên nhiên, thân thiện với môi
            trường và trường tồn với thời gian.
          </Typography>
        </div>
        <div className="flex justify-center lg:justify-start">
          <div className="grid grid-cols-2 gap-8">
            {STATS.map((props, key) => (
              <StatsCard key={key} {...props} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Typography
            variant="h2"
            className="text-3xl font-semibold mb-6 text-blue-gray-900"
          >
            Khách hàng nói về chúng tôi
          </Typography>
          <Typography variant="lead" className="text-lg mb-12 text-gray-600">
            Khám phá những gì khách hàng quý giá của chúng tôi nói về trải
            nghiệm của họ với dịch vụ của chúng tôi. <br></br>Chúng tôi tự hào
            mang lại kết quả xuất sắc và xây dựng các đối tác lâu dài.
          </Typography>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientFeedback;
