"use client";
import withAuth from "@/components/withAuth";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="pt-16">
      <h1>Dashboard</h1>
      <h2>User Info</h2>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default withAuth(DashboardPage);
