import { Suspense } from "react";
import { LoginCard } from "@/components/auth/login-card";
import { PatientLoginHero } from "@/components/auth/patient-login-hero";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientLoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-cream px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          <PatientLoginHero />
          <Suspense fallback={<Skeleton className="h-[380px] w-full max-w-md rounded-3xl" />}>
            <LoginCard mode="patient" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
