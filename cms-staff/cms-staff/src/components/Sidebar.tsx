"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  IconButton,
  Divider,
  Box,
  ListItemButton,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import {
  UserIcon,
  DocumentTextIcon,
  CubeIcon,
  ArchiveIcon,
  CalendarIcon,
  ClipboardListIcon,
  ClipboardCheckIcon,
} from "@heroicons/react/outline";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: "Hợp đồng",
      icon: <DocumentTextIcon className="h-6 w-6" />,
      path: "/contracts",
    },
    {
      text: "Khách hàng",
      icon: <UserIcon className="h-6 w-6" />,
      path: "/customers",
    },
    {
      text: "Ô chứa",
      icon: <CubeIcon className="h-6 w-6" />,
      path: "/niches",
    },
    {
      text: "Dịch vụ",
      icon: <ArchiveIcon className="h-6 w-6" />,
      path: "/services",
    },
    {
      text: "Đơn đặt chỗ",
      icon: <CalendarIcon className="h-6 w-6" />,
      path: "/bookings",
    },
    {
      text: "Đơn đăng ký viếng",
      icon: <ClipboardListIcon className="h-6 w-6" />,
      path: "/visit-requests",
    },
    {
      text: "Đơn đặt dịch vụ",
      icon: <ClipboardCheckIcon className="h-6 w-6" />,
      path: "/service-requests",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 64,
          boxSizing: "border-box",
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#757575", // Dark gray
          color: "#fff", // White text
          zIndex: (theme) => theme.zIndex.drawer + 2, // Ensure Sidebar is on top
        },
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          justifyContent={open ? "space-between" : "center"}
          alignItems="center"
          width="100%"
        >
          {open && (
            <Typography className="pl-12" variant="h6" noWrap>
              Quản lý
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: "#fff" }} />
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} passHref key={item.text} legacyBehavior>
            <ListItemButton
              component="a"
              selected={pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#2196f3", // Blue color when selected
                  color: "#fff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#1976d2",
                },
                justifyContent: "center",
                px: open ? 2.5 : 0,
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? "#fff" : "#fff",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText primary={item.text} sx={{ color: "#fff" }} />
              )}
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
