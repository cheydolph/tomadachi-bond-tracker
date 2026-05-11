"use client";

import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ name, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus "Cancel" on mount (safe default)
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // ESC closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  // Trap focus between Cancel and Remove
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = [cancelRef.current, confirmRef.current].filter(
      Boolean
    ) as HTMLButtonElement[];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    /* Backdrop — rendered at page level so transform stacking context never clips it */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      {/* Dialog card — dialog-pop keyframe lives in globals.css */}
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: "dialog-pop 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Header stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-rose-500" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="mb-3 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <span className="text-base text-red-500">✕</span>
            </div>
            <div>
              <h2
                id="confirm-title"
                className="font-fredoka text-base font-bold leading-snug text-gray-800"
              >
                Remove &ldquo;{name}&rdquo;?
              </h2>
            </div>
          </div>

          {/* Required spec message */}
          <p
            id="confirm-desc"
            className="mb-6 pl-12 text-sm leading-relaxed text-gray-600"
          >
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-800">{name}</span>? This will delete
            all their bond data.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button ref={cancelRef} className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className="cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                boxShadow: "0 2px 8px rgba(239,68,68,0.35)",
                border: "none",
                fontFamily: "Nunito",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "";
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
