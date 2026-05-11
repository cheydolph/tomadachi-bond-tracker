import React from "react";

export default function Footer(): JSX.Element {
  return (
    <footer
      className="mt-12 w-full border-t border-gray-100"
      style={{ background: "#ffef00" }}
    >
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3 px-4 py-6 text-center">
        <p className="text-xs font-semibold">
          Tomadachi Bond Tracker is not affiliated with Nintendo.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a
            href="/terms-of-service"
            className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-rose-500"
          >
            Terms of Service
          </a>
          <span className="select-none text-xs text-gray-300">·</span>
          <a
            href="/privacy"
            className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-rose-500"
          >
            Privacy Policy
          </a>
          <span className="select-none text-xs text-gray-300">·</span>
          <span className="text-xs text-red-400">Made by TDL</span>
        </div>

        <p className="text-xs text-gray-400">
          &copy; 2026 Tomadachi Bond Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
