import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      <AdminPanel />
    </main>
  );
}
