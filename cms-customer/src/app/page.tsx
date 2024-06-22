"use client";

import CustomerDashboard from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-300">
      <CustomerDashboard/>
    </main>
  );
}
