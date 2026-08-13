import { DashboardClient } from "@/components/dashboard-client";

export const metadata = {
  title: "Creator Dashboard — FacelessReels.ai",
  description: "Manage your automated faceless video generation, scheduling queue, and 4-channel pipelines.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
