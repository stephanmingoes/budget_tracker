"use client";
import DashboardLayout from "@/app/dashboard/components/dashboardLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Budget tracker dashboard",
};
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout>{children}</DashboardLayout>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
