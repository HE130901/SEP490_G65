"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "@/context/StateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast as sonnerToast } from "sonner";
import Link from "next/link";
import { User, Lock, CalendarDays } from "lucide-react";

export default function UserProfileSetting() {
  const { user, updateUser } = useStateContext();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [address, setAddress] = useState(user?.address || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhoneNumber(user.phone);
      setDateOfBirth(user.dateOfBirth);
      setGender(user.gender);
      setAddress(user.address);
    }
  }, [user]);

  const handleSavePersonalInfo = async () => {
    const updatedUser = {
      ...user,
      fullName,
      email,
      phone: phoneNumber,
      dateOfBirth,
      gender,
      address,
    };

    try {
      await updateUser(updatedUser);
      sonnerToast.success("Thông tin cá nhân đã được cập nhật thành công");
    } catch (error) {
      sonnerToast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleSavePassword = () => {
    if (newPassword === confirmNewPassword) {
      // Logic to change password
      sonnerToast.success("Mật khẩu đã được thay đổi thành công");
    } else {
      sonnerToast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="p-6 md:p-8 lg:p-10 border-r border-border">
        <nav className="grid gap-4">
          <Link
            href="#personal-info"
            className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            prefetch={false}
          >
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </Link>
          <Link
            href="#security-settings"
            className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            prefetch={false}
          >
            <Lock className="h-5 w-5" />
            Cài đặt bảo mật
          </Link>
        </nav>
      </div>
      <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-8">
        <div id="personal-info">
          <h2 className="text-2xl font-bold tracking-tight">
            Thông tin cá nhân
          </h2>
          <p className="text-muted-foreground">
            Cập nhật chi tiết cơ bản và thông tin liên hệ của bạn.
          </p>
          <form className="grid gap-6 mt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và Tên</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {dateOfBirth ? dateOfBirth : "Chọn ngày"}
                      <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={(date) =>
                        setDateOfBirth(date.toLocaleDateString())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ của bạn"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <Button onClick={handleSavePersonalInfo} className="ml-auto">
              Lưu thay đổi
            </Button>
          </form>
        </div>
        <div id="security-settings">
          <h2 className="text-2xl font-bold tracking-tight">Cài đặt bảo mật</h2>
          <p className="text-muted-foreground">
            Cập nhật mật khẩu và các chi tiết bảo mật khác.
          </p>
          <form className="grid gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>
            <Button onClick={handleSavePassword} className="ml-auto">
              Cập nhật mật khẩu
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
