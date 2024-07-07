"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "@/utils/axiosInstance";
import styles from "./reset-pass.module.css";

export default function Component() {
  // State variables
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/auth/request-password-reset", {
        email,
      });

      if (response.status === 200) {
        setMessage(
          "Yêu cầu đặt lại mật khẩu đã được gửi thành công. Hãy kiểm tra email của bạn."
        );
      }
    } catch (err) {
      if ((err as any).response) {
        setError((err as any).response?.data?.message || "Đã xảy ra lỗi.");
      } else if ((err as any).request) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        setError("Đã xảy ra lỗi.");
      }
      console.error("An error occurred:", err);
    }
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen`}>
      <div className={styles["bg-animation"]} />
      <div className="relative z-10 space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Quên mật khẩu</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Nhập địa chỉ email của bạn để khôi phục mật khẩu
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Gửi yêu cầu
          </Button>
          <div className="flex justify-between items-center">
            <Link
              href="/auth/login"
              className="inline-block text-sm underline"
              prefetch={false}
            >
              Quay lại trang đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
