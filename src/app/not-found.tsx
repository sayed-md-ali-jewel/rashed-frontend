"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-16 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue/10 text-blue">
          <SearchX className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-4xl font-bold">{t("notFound.title")}</h1>
        <p className="mt-4 text-muted">{t("notFound.description")}</p>
        <Link href="/appointments" className="mt-8 inline-flex">
          <Button variant="gold" size="lg" className="rounded-full font-bold cursor-pointer">
            {t("notFound.button")}
          </Button>
        </Link>
      </div>
    </main>
  );
}
