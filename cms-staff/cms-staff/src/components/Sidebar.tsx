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
  Button,
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
  HomeIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const staffMenuItems = [
    {
      text: "Trang chủ",
      icon: <HomeIcon className="h-6 w-6" />,
      path: "/dashboard",
    },
    {
      text: "Đơn đặt ô chứa",
      icon: <CalendarIcon className="h-6 w-6" />,
      path: "/niche-reservations",
    },
    {
      text: "Đơn đăng ký viếng",
      icon: <ClipboardListIcon className="h-6 w-6" />,
      path: "/visit-registrations",
    },
    {
      text: "Đơn đặt dịch vụ",
      icon: <ClipboardCheckIcon className="h-6 w-6" />,
      path: "/service-requests",
    },
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
      text: "Dịch vụ & sản phẩm",
      icon: <ShoppingCartOutlinedIcon className="h-6 w-6" />,
      path: "/services",
    },
  ];

  const managerMenuItems = [
    {
      text: "Trang chủ",
      icon: <HomeIcon className="h-6 w-6" />,
      path: "/manager-dashboard",
    },
    {
      text: "Số liệu Hợp Đồng",
      icon: <InsertChartOutlinedSharpIcon className="h-6 w-6" />,
      path: "/contract-reports",
    },
    {
      text: "Số liệu Dịch Vụ",
      icon: <InsertChartOutlinedSharpIcon className="h-6 w-6" />,
      path: "/service-reports",
    },
    {
      text: "Số liệu nhà lưu trữ ",
      icon: <InsertChartOutlinedSharpIcon className="h-6 w-6" />,
      path: "/niche-reports",
    },
    {
      text: "Thiết lập Hệ thống",
      icon: <SettingsOutlinedIcon className="h-6 w-6" />,
      path: "/settings",
    },
  ];

  const menuItems =
    user?.role === "Manager" ? managerMenuItems : staffMenuItems;

  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 64,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 64,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#757575",
          color: "#fff",
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
            <Typography className="pl-8" variant="h6" noWrap>
              An Bình Viên
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: "#fff" }} />
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <Link href={item.path} passHref legacyBehavior>
              <ListItemButton
                component="a"
                selected={pathname === item.path}
                onClick={handleMenuItemClick}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#2196f3",
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
            {/* Divider after "Trang chủ" */}
            {index === 0 && <Divider sx={{ borderColor: "#fff" }} />}{" "}
            {/* Divider after "Đơn đặt dịch vụ" */}
            {index === 3 && <Divider sx={{ borderColor: "#fff" }} />}{" "}
            {index === 7 && <Divider sx={{ borderColor: "#fff" }} />}{" "}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        {open && (
          <>
            <Image
              src="/images/FPT.svg"
              alt="logo"
              width={150}
              height={50}
              className="pb-4"
            />
            <Typography variant="caption" color="inherit" fontStyle="oblique">
              © SEP490-G65
            </Typography>
            <Typography variant="caption" color="inherit" fontStyle="initial">
              Columbarium Management System
            </Typography>
          </>
        )}
      </Box>
      <Divider sx={{ borderColor: "#fff" }} />
      {open && (
        <>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
