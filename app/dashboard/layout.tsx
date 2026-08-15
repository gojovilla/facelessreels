import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";

export const metadata = {
  title: "Dashboard — facelessreels",
  description: "AI Faceless Video Generator & Multi-Channel Auto-Scheduler Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
