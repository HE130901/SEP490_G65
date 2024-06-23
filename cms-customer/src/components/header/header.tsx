"use client";

import logo from "../../../public/images/logo.png";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStateContext } from "@/context/state-context";
import { cn } from "@/lib/utils";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  HomeIcon,
  PencilSquareIcon,
  PowerIcon,
  RectangleGroupIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SidebarLink = ({ label, icon: Icon, href, active }) => (
  <Link href={href}>
    <div
      className={`flex items-center px-4 py-2 text-gray-800 ${
        active ? "bg-stone-300 text-white" : "hover:bg-stone-200"
      } rounded-md transition-colors duration-300`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-800"}`} />
      <span
        className={`ml-2 text-sm font-medium ${
          active ? "text-white" : "text-gray-800"
        }`}
      >
        {label}
      </span>
    </div>
  </Link>
);

const Sidebar = ({ currentView }) => (
  <div className="px-4 py-6 space-y-2">
    <SidebarLink
      label="Quản lý ô chứa"
      icon={HomeIcon}
      href="/dashboard"
      active={currentView === "dashboard"}
    />
    <SidebarLink
      label="Đặt lịch viếng"
      icon={PencilSquareIcon}
      href="/visit-registration"
      active={currentView === "visitRegistration"}
    />
    <SidebarLink
      label="Đặt dịch vụ"
      icon={DocumentTextIcon}
      href="/service-order"
      active={currentView === "serviceOrder"}
    />
    <SidebarLink
      label="Hợp đồng"
      icon={RectangleGroupIcon}
      href="/contract-manager"
      active={currentView === "contractManager"}
    />
  </div>
);

export function Header({ currentView, setCurrentView }) {
  const { user, logout } = useStateContext();

  const components = [
    {
      title: "Đặt chỗ trực tuyến",
      href: "/niche-reservation",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos cumque, quas, quae, quidem dolorum voluptatum quia laborum voluptatem natus doloremque iusto.",
    },
    {
      title: "Đăng ký viếng thăm",
      href: "/visit-registration",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos cumque, quas, quae, quidem dolorum voluptatum quia",
    },
    {
      title: "Đặt dịch vụ ",
      href: "/service-order",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos cumque, quas, quae, quidem dolorum voluptatum quia",
    },
    {
      title: "Các dịch vụ khác",
      href: "/dashboard",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo",
    },
  ];

  const ListItem = React.forwardRef(
    ({ className, title, children, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
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
            </a>
          </NavigationMenuLink>
        </li>
      );
    }
  );
  ListItem.displayName = "ListItem";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 bg-stone-100 shadow-lg text-black`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          {user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button className="mr-4 p-2 bg-stone-400 text-white rounded-md shadow-md">
                  <Bars3Icon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className={`w-64 bg-slate-100 rounded-md shadow-md`}
              >
                <Sidebar
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                />
              </SheetContent>
            </Sheet>
          )}
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
                style={{ width: "50", height: "150" }}
              />
            </motion.div>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Trang chủ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 text-lg font-medium">
                          An Bình Viên
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Quos cumque, quas, quae, quidem dolorum
                          voluptatum quia laborum voluptatem natus doloremque
                          iusto.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/" title="Giới thiệu chung">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </ListItem>
                  <ListItem href="/dashboard" title="Dịch vụ">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </ListItem>
                  <ListItem href="/about" title="Thông tin">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dịch vụ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Thông tin
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
                    <Link href="/dashboard/profile-manager">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Hồ sơ của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/ShoppingCart">
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Giỏ hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/reservation-manager">
                      <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                      Đơn của tôi
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
