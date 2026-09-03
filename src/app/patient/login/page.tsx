import { Suspense } from "react";
import { LoginCard } from "@/components/auth/login-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientLoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-cream px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm mb-6">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              Patient Portal Access
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink md:text-5xl">
              Patient Login
            </h1>
            <p className="mt-4 text-xl font-semibold text-blue">
              Login with only your name and mobile number.
            </p>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[#3c3c3c]">
              No email or password required. Instantly check your queue serial status, view doctor visit records, and manage your consultation appointments.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-[380px] w-full max-w-md rounded-3xl" />}>
            <LoginCard mode="patient" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
