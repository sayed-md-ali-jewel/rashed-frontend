import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Portal | Doctor Management System",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-portal font-sans antialiased text-ink bg-[#f4f6f8] min-h-screen" data-admin-root="true" lang="en">
      {children}
    </div>
  );
}
