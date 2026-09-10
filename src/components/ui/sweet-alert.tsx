"use client";

import React, { useEffect, useState } from "react";
import { Check, X, AlertTriangle, Info, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export type SweetAlertType = "success" | "error" | "warning" | "info" | "question";

export type SweetAlertConfig = {
  isOpen: boolean;
  type?: SweetAlertType;
  title: string;
  text?: string;
  confirmButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  timer?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function SweetAlertModal({
  config,
  onClose
}: {
  config: SweetAlertConfig;
  onClose: () => void;
}) {
  const { t, translate } = useLanguage();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!config.isOpen) {
      setProgress(100);
      return;
    }

    if (config.timer && config.timer > 0) {
      const intervalMs = 20;
      const step = (intervalMs / config.timer) * 100;
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [config.isOpen, config.timer, onClose]);

  if (!config.isOpen) return null;

  const type = config.type || "success";

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    onClose();
  };

  const cancelLabel = config.cancelButtonText ? translate(config.cancelButtonText) : t("portal.cancel", {}, "Cancel");
  const confirmLabel = config.confirmButtonText ? translate(config.confirmButtonText) : "OK";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Animated Icon Circle */}
        <div className="mb-5 flex justify-center">
          {type === "success" && (
            <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-emerald-500/25 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10">
              <div className="size-12 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                <Check className="size-7 stroke-[3]" />
              </div>
            </div>
          )}

          {type === "error" && (
            <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-rose-500/25 bg-rose-50 text-rose-600 shadow-lg shadow-rose-500/10">
              <div className="size-12 rounded-full bg-rose-500 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                <X className="size-7 stroke-[3]" />
              </div>
            </div>
          )}

          {type === "warning" && (
            <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-amber-500/25 bg-amber-50 text-amber-600 shadow-lg shadow-amber-500/10">
              <div className="size-12 rounded-full bg-amber-500 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                <AlertTriangle className="size-6 stroke-[2.5]" />
              </div>
            </div>
          )}

          {type === "info" && (
            <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-blue-500/25 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/10">
              <div className="size-12 rounded-full bg-blue-500 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                <Info className="size-7 stroke-[2.5]" />
              </div>
            </div>
          )}

          {type === "question" && (
            <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-teal-500/25 bg-teal-50 text-teal-600 shadow-lg shadow-teal-500/10">
              <div className="size-12 rounded-full bg-teal-600 text-white flex items-center justify-center animate-in zoom-in-50 duration-300">
                <HelpCircle className="size-7 stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {translate(config.title)}
        </h3>

        {/* Description */}
        {config.text && (
          <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">
            {translate(config.text)}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {config.showCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`h-11 px-6 rounded-2xl text-xs font-black text-white shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
              type === "error" || type === "warning"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20"
            }`}
          >
            {confirmLabel}
          </button>
        </div>

        {/* Timer Progress Bar */}
        {config.timer && config.timer > 0 ? (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div
              className={`h-full transition-all duration-75 ease-linear ${
                type === "error"
                  ? "bg-rose-500"
                  : type === "warning"
                  ? "bg-amber-500"
                  : "bg-teal-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
