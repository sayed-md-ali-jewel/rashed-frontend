import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-16 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">The page may have moved or the schedule is no longer available.</p>
        <Link href="/appointments" className="mt-8 inline-flex">
          <Button>View appointments</Button>
        </Link>
      </div>
    </main>
  );
}
