"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/context/StateContext";
import Loading from "@/components/ui/Loading";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth = (props: any) => {
    const { user, loading } = useStateContext();
    const router = useRouter();
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
      if (!loading && !user) {
        setShowLoading(true);
        const timer = setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải...
          </Typography>
        </Box>
      );
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    if (showLoading) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="#f0f0f0"
          p={4}
          textAlign="center"
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cần đăng nhập để sử dụng tính năng này
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
          </Typography>
        </Box>
      );
    }

    return null;
  };

  WithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
