"use client";

import { useAuth } from "@/context/AuthContext";

export default function StaffDashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user data</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
