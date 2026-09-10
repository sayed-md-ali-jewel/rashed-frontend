"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Facebook, Linkedin, MessageCircle, Send, Twitter } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const channels = [
  {
    label: "Facebook",
    icon: Facebook,
    bg: "bg-[#1877f2] hover:bg-[#0d65d9] text-white",
    href: (url: string, title: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    bg: "bg-[#25d366] hover:bg-[#20ba5a] text-white",
    href: (url: string, title: string) => `https://api.whatsapp.com/send?text=${title}%20-%20Book%20serial:%20${url}`
  },
  {
    label: "X (Twitter)",
    icon: Twitter,
    bg: "bg-black hover:bg-neutral-800 text-white",
    href: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${url}&text=${title}`
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    bg: "bg-[#0a66c2] hover:bg-[#084e96] text-white",
    href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  },
  {
    label: "Telegram",
    icon: Send,
    bg: "bg-[#229ed9] hover:bg-[#1c87ba] text-white",
    href: (url: string, title: string) => `https://t.me/share/url?url=${url}&text=${title}`
  }
];

export function SocialShare({ title, path }: { title: string; path: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setFullUrl(`${origin}${path}`);
    }
  }, [path]);

  const targetUrl = fullUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ""}${path}`;
  const encodedUrl = encodeURIComponent(targetUrl);
  const encodedTitle = encodeURIComponent(`Consultation Slot: ${title}`);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {channels.map((channel) => {
        const Icon = channel.icon;
        const href = channel.href(encodedUrl, encodedTitle);
        return (
          <a
            key={channel.label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("share.shareOn", { channel: channel.label })}
            className="inline-flex"
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 cursor-pointer ${channel.bg}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{channel.label}</span>
            </button>
          </a>
        );
      })}

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition hover:bg-panel hover:-translate-y-0.5 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">{t("share.linkCopied")}</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-muted" />
            <span>{t("share.copyLink")}</span>
          </>
        )}
      </button>
    </div>
  );
}
