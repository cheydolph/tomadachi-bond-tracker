import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-100 mt-12"
      style={{ background: "rgba(255,255,255,0.6)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col items-center gap-3 text-center">
        {/* Disclaimer */}
        <p className="text-xs text-gray-400">
          Tomadachi Bond Tracker is not affiliated with Nintendo.
        </p>

        {/* Links row */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
          <a
            href="/terms-of-service"
            className="text-xs text-gray-500 hover:text-rose-500 underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </a>
          <span className="text-gray-300 text-xs select-none">·</span>
          <a
            href="/privacy"
            className="text-xs text-gray-500 hover:text-rose-500 underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300 text-xs select-none">·</span>
          <span className="text-xs text-gray-400">Made by TDL</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          &copy; 2026 Tomadachi Bond Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
