"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useStateContext } from "@/context/StateContext";
import { cn } from "@/lib/utils";
import {
  ArrowRightOnRectangleIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ClipboardDocumentListIcon,
  UserIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../../public/images/logo.png";

export function Header({}: {}) {
  const { user, logout } = useStateContext();
  const ListItem = React.forwardRef<
    HTMLAnchorElement,
    {
      className?: string;
      title: string;
      children: React.ReactNode;
      href: string;
    }
  >(({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 bg-white shadow-lg text-black `}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Link href="/" passHref>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-lg overflow-hidden hover:cursor-pointer"
            >
              <Image
                alt="logo"
                src={logo}
                height={50}
                width={150}
                priority
                style={{ width: "150px", height: "auto" }}
              />
            </motion.div>
          </Link>
        </div>
        <NavigationMenu className="lg:pr-24 ">
          <NavigationMenuList>
            <NavigationMenuItem className="hidden md:block ">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Trang chủ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden md:block">
              <Link href="/niche-reservation" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Đặt ô chứa
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Dịch vụ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-start  rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/dashboard"
                      >
                        <div className="mb-2 text-lg font-medium">Dịch vụ</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          An Bình Viên cung cấp các dịch vụ tiện ích cho khách
                          hàng sở hữu ô chứa.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <ListItem href="/niche-reservation" title="Đặt ô chứa">
                    Lựa chọn ô và lên lịch ký hợp đồng.
                  </ListItem>
                  <ListItem href="/dashboard" title="Quản lý ô chứa">
                    Xem thông tin chi tiết về ô chứa của bạn.
                  </ListItem>
                  <ListItem href="/service-order" title="Đặt dịch vụ">
                    Lựa chọn các dịch vụ của chúng tôi.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Thông tin liên hệ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-transform duration-300 transform rounded-full shadow-lg hover:scale-105 text-black border bg-white">
                <UserCircleIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/user-profile">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Tài khoản của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                      Hợp đồng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/purchase">
                      <ListBulletIcon className="h-5 w-5 mr-2" />
                      Đơn mua
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <PowerIcon className="h-5 w-5 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Đăng nhập
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
