import AdminShell from "./_components/AdminShell";
import { AdminRoute } from "@/pages/PrivateRoutes";

export const metadata = {
  title: "Admin — Actual IELTS Questions",
};

export default function AdminLayout({ children }) {
  return (
    <AdminRoute>
      <AdminShell>{children}</AdminShell>
    </AdminRoute>
  );
}
