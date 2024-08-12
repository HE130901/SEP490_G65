"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// Define the validation schema using Zod
const schema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }), // Email must be a valid email address
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }), // Password must be at least 6 characters long
});

const Login = () => {
  const { login } = useAuth(); // Get the login function from the AuthContext
  const {
    register, // Register function to register input fields
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Object containing form errors
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema), // Use Zod schema for validation
  });

  // Handle form submission
  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    try {
      await login(data.email, data.password); // Attempt to log in with provided email and password
      toast.success("Đăng nhập thành công."); // Show success message on successful login
    } catch (error) {
      if ((error as Error).message === "AccessDenied") {
        toast.error(
          "Đăng nhập thất bại.  Bạn không có quyền truy cập vào hệ thống" // Show error message if access is denied
        );
      } else {
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập" // Show error message for other login failures
        );
      }
    }
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen`}>
      <div />
      <div className="relative z-10 space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Đăng nhập</h1> {/* Login title */}
          <p className="text-gray-500 dark:text-gray-400 pt-2">
            Nhập thông tin của bạn để truy cập vào hệ thống quản lý{" "}
            {/* Login description */}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label> {/* Email label */}
            <Input
              id="email"
              type="email"
              placeholder="email@abc.com"
              {...register("email")} // Register email input
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message} {/* Display email error message */}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label> {/* Password label */}
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")} // Register password input
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message} {/* Display password error message */}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Đăng nhập {/* Submit button */}
          </Button>
          <div className="flex justify-between items-center">
            <Link
              href="/auth/reset-pass"
              className="inline-block text-sm underline"
              prefetch={false}
            >
              Quên mật khẩu? {/* Forgot password link */}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; // Export the Login component
