"use client";

import React, { useRef, useState } from "react";
import { Check, Copy, FileText, Image as ImageIcon, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MediaAsset = {
  _id?: string;
  id?: string;
  title?: string;
  url?: string;
  alt?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export interface FileUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  mediaList?: MediaAsset[];
  onUploadSuccess?: (newMedia: MediaAsset) => void;
  className?: string;
}

export function FileUploadInput({
  label,
  value,
  onChange,
  placeholder = "Enter URL or upload file...",
  accept = "image/*,application/pdf",
  mediaList = [],
  onUploadSuccess,
  className = ""
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to upload file");

      const uploadedUrl = json.data?.url || "";
      onChange(uploadedUrl);
      if (onUploadSuccess && json.data) {
        onUploadSuccess(json.data);
      }
    } catch (err: any) {
      setError(err.message || "Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    const fullUrl = value.startsWith("http") ? value : typeof window !== "undefined" ? window.location.origin + value : value;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImage = value && (
    value.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
    value.startsWith("data:image/") ||
    value.startsWith("/uploads/") ||
    value.includes("images.unsplash.com")
  );

  return (
    <div className={`space-y-2 text-xs ${className}`}>
      {label && <label className="block font-medium text-slate-300">{label}</label>}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept={accept}
        className="hidden"
      />

      {/* Input + Action Buttons */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-slate-800 bg-slate-950 pr-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-teal-500 rounded-xl"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs rounded-xl gap-1.5 shrink-0 px-3 h-9"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload"}</span>
        </Button>

        {/* Choose from Media Library Button */}
        {mediaList.length > 0 && (
          <Button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs rounded-xl gap-1.5 shrink-0 px-3 h-9"
            title="Choose from Media Library"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Library</span>
          </Button>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}

      {/* Live Preview Bar */}
      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
            {isImage ? (
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <FileText className="h-6 w-6 text-slate-500" />
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="truncate font-mono text-[11px] text-slate-300" title={value}>
              {value}
            </p>
            <p className="text-[10px] text-teal-400/80">Asset linked successfully</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              onClick={handleCopyUrl}
              variant="outline"
              size="sm"
              className="h-7 px-2 border-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] gap-1"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              type="button"
              onClick={() => onChange("")}
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-slate-800 text-rose-400 hover:bg-rose-950/30 rounded-lg"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
                <span>Select Asset from Media Library</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-800">
              {mediaList.map((asset) => {
                const assetUrl = asset.url || "";
                const isSelected = value === assetUrl;
                return (
                  <button
                    key={asset._id || asset.id || assetUrl}
                    type="button"
                    onClick={() => {
                      onChange(assetUrl);
                      setIsLibraryOpen(false);
                    }}
                    className={`group relative aspect-square overflow-hidden rounded-xl border p-1 transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-500/20 ring-2 ring-teal-500"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <img
                      src={assetUrl}
                      alt={asset.alt || asset.title || "Media"}
                      className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-1 bottom-1 truncate rounded bg-black/70 px-1 py-0.5 text-[9px] text-white">
                      {asset.title || "Image"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-3">
              <Button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
