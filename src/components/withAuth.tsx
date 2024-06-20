"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/context/StateContext";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth = (props: any) => {
    const { user, loading } = useStateContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/auth/login");
      }
    }, [loading, user, router]);

    if (loading) {
      return <p>Loading...</p>; // or a spinner/loader
    }

    if (user) {
      return <WrappedComponent {...props} />;
    }

    return null; // Prevent rendering the component if the user is not authenticated
  };

  WithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
