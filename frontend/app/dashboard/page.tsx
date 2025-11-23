import type { Metadata } from "next";
import { Dashboard } from "../login/components/Dashboard";
import { ProtectedRoute } from "../login/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Dashboard | CSE 230",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
