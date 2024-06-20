"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "@/api/axios-config";

export default function Component() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || "Đã xảy ra lỗi.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Đã xảy ra lỗi.");
      }
      console.error("An error occurred:", err);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-36 mb-96">
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
  );
}
