// app/components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import {
  Group,
  Store,
  Build,
  CalendarToday,
  Assignment,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

const menuItems = [
  {
    text: "Quản lý hợp đồng",
    icon: <Assignment />,
    path: "/contract-management",
  },
  { text: "Quản lý khách hàng", icon: <Group />, path: "/customer-management" },
  { text: "Quản lý ô chứa", icon: <Store />, path: "/storage-management" },
  { text: "Quản lý dịch vụ", icon: <Build />, path: "/service-management" },
  {
    text: "Quản lý đơn đặt chỗ",
    icon: <CalendarToday />,
    path: "/booking-management",
  },
  {
    text: "Quản lý đơn đăng ký viếng",
    icon: <Assignment />,
    path: "/registration-management",
  },
  {
    text: "Quản lý đơn đặt dịch vụ",
    icon: <CheckCircle />,
    path: "/service-order-management",
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b pt-16 from-gray-50 to-gray-200 shadow-lg ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex justify-end p-2">
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-700"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <div className="flex-1 flex flex-col justify-center">
        <List>
          {menuItems.map((item) => (
            <Link href={item.path} key={item.text} passHref>
              <ListItem
                button
                className="text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-200 rounded-lg my-1 mx-2"
              >
                <ListItemIcon className="text-gray-700">
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={
                      <Typography variant="body1">{item.text}</Typography>
                    }
                  />
                )}
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
      <Divider />
      <div className="p-4">
        {!collapsed && (
          <Typography variant="caption" className="text-gray-500">
            © 2024 An Bình Viên
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
