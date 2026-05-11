"use client";

import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  name,
  onConfirm,
  onCancel,
}: Readonly<ConfirmDialogProps>): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Open as a native modal — showModal() creates the ::backdrop overlay
  // automatically, handles z-index stacking, and traps focus natively.
  // Replaces the hand-rolled fixed backdrop div + role="dialog". (S6819)
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // The native <dialog> "cancel" event fires on ESC press — no window
  // keydown listener needed. preventDefault() stops the browser from closing
  // the dialog before onCancel() runs (we manage state ourselves).
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      e.preventDefault();
      onCancel();
    };
    el.addEventListener("cancel", handler);
    return () => el.removeEventListener("cancel", handler);
  }, [onCancel]);

  // Focus "Cancel" on mount — safe default (destructive action is never default).
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Manual focus trap — supplements native modal focus management for
  // browsers where it is incomplete.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = [cancelRef.current, confirmRef.current].filter(
      Boolean
    ) as HTMLButtonElement[];
    const first = focusable[0];
    const last = focusable.at(-1);
    // Guard added for ts(18048) — focusable array could theoretically be empty
    // before refs are assigned.
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-sm overflow-hidden rounded-2xl border-0 p-0 shadow-2xl"
      style={{ animation: "dialogPop 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onKeyDown={handleKeyDown}
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

        {/* Body */}
        <p id="confirm-desc" className="mb-6 pl-12 text-sm leading-relaxed text-gray-600">
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
              e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </dialog>
  );
}
