"use client";

import React, { useState } from "react";
import ComboboxSelector from "@/components/visit-registration/ComboboxSelector";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios-config";
import { toast } from "sonner";
import { useStateContext } from "@/context/state-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/ui/carouselExtension";
import Image from "next/image";

const visitSchema = z.object({
  customerName: z.string().min(1, "Họ và tên là bắt buộc"),
  visitDate: z.string().refine(
    (val) => {
      const visitDate = new Date(val);
      const today = new Date();
      return visitDate >= today;
    },
    {
      message: "Ngày đăng ký phải là ngày hiện tại hoặc sau đó.",
    }
  ),
  note: z.string().optional(),
});

const VisitRegistration = () => {
  const { selectedNiche, user, fetchVisitRegistrations } = useStateContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitSchema),
  });

  const onSubmit = async (data) => {
    if (!selectedNiche) {
      toast.error("Vui lòng chọn một ô.");
      return;
    }

    const dataToSubmit = {
      customerId: user.customerId,
      nicheId: selectedNiche.nicheId,
      visitDate: data.visitDate,
      note: data.note,
      customerName: data.customerName,
    };

    setIsSubmitting(true);
    try {
      await axios.post("/api/VisitRegistrations", dataToSubmit);
      toast.success("Đăng ký thăm viếng thành công!");
      fetchVisitRegistrations(user.customerId);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đăng ký thăm viếng thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    "/images/visit12.jpg",
    "/images/visit.jpg",
    "/images/visit13.jpg",
    "/images/image.png",
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Đăng ký viếng thăm
      </h1>
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <ComboboxSelector />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-1/3 p-4 md:p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-6">
            <div className="mb-4 md:mb-0 flex-1">
              <Label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </Label>
              <Input
                type="text"
                id="customerName"
                {...register("customerName")}
                className="mt-1 p-2 md:p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.customerName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </Label>
              <Input
                type="text"
                id="phone"
                {...register("phone")}
                className="mt-1 p-2 md:p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-4 md:mb-6">
            <Label
              htmlFor="visitDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày viếng thăm
            </Label>
            <Input
              type="datetime-local"
              id="visitDate"
              {...register("visitDate")}
              className="mt-1 p-2 md:p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.visitDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.visitDate.message}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-6">
            <Label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Ghi chú
            </Label>
            <Textarea
              id="note"
              {...register("note")}
              className="mt-1 p-2 md:p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận"}
          </Button>
        </form>
        <div className="md:w-2/3 mt-4 md:mt-0">
          <Carousel orientation="vertical" className="flex items-center gap-2">
            <div className="relative w-full">
              <CarouselMainContainer className="h-96">
                {images.map((src, index) => (
                  <SliderMainItem
                    key={index}
                    className="border border-muted flex items-center justify-center h-96 rounded-md"
                  >
                    <Image
                      src={src}
                      alt={`Slide ${index + 1}`}
                      width={800}
                      height={800}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </SliderMainItem>
                ))}
              </CarouselMainContainer>
            </div>
            <CarouselThumbsContainer className="h-60 basis-1/4">
              {images.map((src, index) => (
                <SliderThumbItem
                  key={index}
                  index={index}
                  className="rounded-md bg-transparent"
                >
                  <Image
                    src={src}
                    alt={`Thumb ${index + 1}`}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover rounded-md cursor-pointer bg-background"
                  />
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default VisitRegistration;
