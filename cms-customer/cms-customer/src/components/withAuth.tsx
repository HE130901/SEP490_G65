"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/context/StateContext";
import Loading from "@/components/ui/Loading";

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
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [loading, user, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    if (showLoading) {
      return <Loading />;
    }

    return null;
  };

  WithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
