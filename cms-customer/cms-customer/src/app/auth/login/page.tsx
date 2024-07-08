"use client";

import Link from "next/link";
import { useStateContext } from "@/context/StateContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./login.module.css";
import { useState } from "react";
import { Loader } from "lucide-react";

// Define the validation schema using Zod
const schema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

// Define the type using the schema
type FormData = z.infer<typeof schema>;

const Login = () => {
  const { login } = useStateContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen`}>
      <div className={styles["bg-animation"]} />
      <div className="relative z-10 space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Đăng nhập</h1>
          <p className="text-gray-500 dark:text-gray-400 pt-2">
            Nhập thông tin của bạn để truy cập vào hệ thống
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
          <div className="flex justify-between items-center">
            <Link
              href="/auth/reset-pass"
              className="inline-block text-sm underline"
              prefetch={false}
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
