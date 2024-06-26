"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Badge,
} from "@mui/material";
import { AccountCircle, Notifications } from "@mui/icons-material";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifEl, setNotifEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifMenu = (event) => {
    setNotifEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotifEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#757575",
      }} // Medium gray
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, paddingLeft: "240px" }} // Adjust padding to match the sidebar width
        ></Typography>
        <Box>
          <IconButton color="inherit" onClick={handleNotifMenu}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notifEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(notifEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Thông báo 1</MenuItem>
            <MenuItem onClick={handleClose}>Thông báo 2</MenuItem>
            <MenuItem onClick={handleClose}>Thông báo 3</MenuItem>
            <MenuItem onClick={handleClose}>Thông báo 4</MenuItem>
          </Menu>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Quản lý tài khoản</MenuItem>
            <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
