import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container-page py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-6 h-16 max-w-3xl" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </main>
  );
}
