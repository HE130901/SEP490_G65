"use client";

import React from "react";
import Link from "next/link";
import {
  HomeIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/solid";

const SidebarLink = ({ label, icon: Icon, href, active }) => (
  <Link href={href}>
    <div
      className={`flex items-center px-6 py-4 text-lg ${
        active
          ? "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white"
          : "hover:bg-gray-200 text-gray-900 dark:hover:bg-gray-700 dark:text-white"
      } rounded-md transition-colors duration-300`}
    >
      <Icon
        className={`h-7 w-7 mr-4 ${
          active
            ? "text-gray-900 dark:text-white"
            : "text-gray-900 dark:text-white"
        }`}
      />
      <span className="font-medium truncate whitespace-nowrap overflow-hidden">
        {label}
      </span>
    </div>
  </Link>
);

const Sidebar = ({ currentView, userRole }) => (
  <div className="px-6 py-6 space-y-4">
    <SidebarLink
      label="Trang chủ"
      icon={HomeIcon}
      href="/dashboard"
      active={currentView === "dashboard"}
    />
    <SidebarLink
      label="Đặt ô chứa"
      icon={BuildingOfficeIcon}
      href="/dashboard/niche-reservation"
      active={currentView === "nicheReservation"}
    />
    <SidebarLink
      label="Đặt lịch viếng"
      icon={PencilSquareIcon}
      href="/dashboard/visit-registration"
      active={currentView === "visitRegistration"}
    />
    <SidebarLink
      label="Đặt dịch vụ"
      icon={DocumentTextIcon}
      href="/dashboard/service-order"
      active={currentView === "serviceOrder"}
    />
    {userRole !== "Guest" && (
      <SidebarLink
        label="Quản lý hợp đồng"
        icon={RectangleGroupIcon}
        href="/dashboard/contract-manager"
        active={currentView === "contractManager"}
      />
    )}
  </div>
);

export { Sidebar };
