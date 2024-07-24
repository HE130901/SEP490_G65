import { z } from "zod";

// Zod schema for form validation
export const schema = z.object({
  type: z.enum(["Gửi theo tháng", "Gửi theo năm"]),
  duration: z.union([
    z
      .number()
      .min(1)
      .max(12)
      .int()
      .refine((val) => val <= 12, {
        message: "Thời gian tối đa là 12 tháng",
      }),
    z
      .number()
      .min(1)
      .max(10)
      .int()
      .refine((val) => val <= 10, {
        message: "Thời gian tối đa là 10 năm",
      }),
  ]),
  name: z.string().min(1, "Tên của bạn là bắt buộc"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại của bạn là bắt buộc")
    .regex(/^(0|\+84)[1-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  contractDate: z.string().refine(
    (val) => {
      const contractDate = new Date(val + "T23:59:00");
      const now = new Date();
      const threeDaysLater = new Date(now);
      threeDaysLater.setDate(now.getDate() + 3);
      return contractDate <= threeDaysLater;
    },
    {
      message:
        "Ngày hẹn ký hợp đồng phải trong vòng tối đa 3 ngày kể từ ngày hiện tại.",
    }
  ),
  signAddress: z.string().min(1, "Địa chỉ ký hợp đồng là bắt buộc"),
  note: z.string().optional(),
  otp: z.string().optional(),
});

export const calculateCost = (type: string, duration: number): number => {
  if (type === "Gửi theo tháng") {
    return duration * 200000;
  } else if (type === "Gửi theo năm") {
    if (duration <= 2) return 2000000;
    if (duration <= 5) return 3500000;
    if (duration <= 9) return 5000000;
    return 7000000;
  }
  return 0;
};

export const getAllowedDates = () => {
  const today = new Date();
  const dates = [today.toISOString().split("T")[0]];
  for (let i = 1; i <= 2; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split("T")[0]);
  }
  return dates;
};
