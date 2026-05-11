"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

import BondFilter from "@/components/BondFilter";
import BondLegend from "@/components/BondLegend";
import ConfirmDialog from "@/components/ConfirmDialog";
import Footer from "@/components/Footer";
import NamePanel from "@/components/NamePanel";
import { useBondData } from "@/lib/hooks/useBondData";
import { useBondFilter } from "@/lib/hooks/useBondFilter";

// Dynamic imports: both components rely on localStorage / browser APIs and
// must not run during SSR.
const BondMatrix = dynamic(() => import("@/components/BondMatrix"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="animate-pulse text-4xl">💕</div>
    </div>
  ),
});

const MobileView = dynamic(() => import("@/components/MobileView"), {
  ssr: false,
});

export default function HomePage() {
  // ── Data & filter state (all business logic lives in the hooks) ──────────
  const bondData = useBondData();
  const bondFilter = useBondFilter();

  // ── UI-only state (layout concerns that don't belong in data hooks) ──────
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close the mobile panel when the user taps outside it.
  useEffect(() => {
    if (!mobilePanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobilePanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobilePanelOpen]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (!bondData.hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-5xl">💕</div>
      </div>
    );
  }

  const { data, pendingRemove, confirmRemove, cancelRemove } = bondData;
  const { activeFilters, toggleFilter, selectAll, clearAll } = bondFilter;
  const hasEnoughNamesToFilter = data.names.length >= 2;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-bg min-h-screen">
      {/* ConfirmDialog is rendered at the page root — outside any sidebar
          element with a CSS transform — so position:fixed covers the full
          viewport and is never clipped by a transform stacking context. */}
      {pendingRemove && (
        <ConfirmDialog
          name={pendingRemove}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}

      {/* ── Sticky header / menu bar ────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-yellow-300 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between gap-2 px-4">
          <div className="flex flex-shrink-0 items-center rounded-xl ring-2 ring-yellow-300 ring-offset-0">
            <img
              src="/tdbt_banner.png"
              alt="Tomadachi Bond Tracker"
              width={130}
              height={24}
              style={{
                height: "24px",
                width: "auto",
                minWidth: "130px",
                maxWidth: "180px",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {data.names.length > 0 && (
              <span className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-base text-gray-500 sm:flex">
                <span>👥</span>
                <span className="font-bold text-gray-700">{data.names.length}</span> Miis
              </span>
            )}
            <button
              onClick={() => setMobilePanelOpen((v) => !v)}
              className="btn-secondary text-md flex items-center gap-1 md:hidden"
              aria-label="Manage Miis"
            >
              <span>👥</span>
              <span>Miis</span>
              {data.names.length > 0 && (
                <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-xs font-bold text-rose-600">
                  {data.names.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Legend bar (mobile / tablet only) */}
      <div className="overflow-x-auto px-4 py-2 lg:hidden">
        <BondLegend />
      </div>

      {/* ── Page body ───────────────────────────────────────────── */}
      <div className="relative mx-auto flex max-w-screen-xl">
        <main className="min-w-0 flex-1 p-4">
          {isMobile ? (
            <>
              {hasEnoughNamesToFilter && (
                <div className="mb-3 rounded-xl border border-gray-100 bg-white/60 px-3 py-2">
                  <BondFilter
                    activeFilters={activeFilters}
                    onToggle={toggleFilter}
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                  />
                </div>
              )}
              <MobileView
                data={data}
                onSetBond={bondData.setBond}
                activeFilters={activeFilters}
              />
            </>
          ) : (
            <>
              <div className="mb-3">
                <h2 className="font-fredoka text-lg font-semibold text-gray-700">
                  Bond Matrix
                </h2>
                {hasEnoughNamesToFilter && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    {data.names.length}×{data.names.length} grid ·{" "}
                    {data.names.length * (data.names.length - 1)} bonds tracked
                  </p>
                )}
              </div>
              {hasEnoughNamesToFilter && (
                <div className="mb-3 rounded-xl border border-gray-100 bg-white/60 px-3 py-2">
                  <BondFilter
                    activeFilters={activeFilters}
                    onToggle={toggleFilter}
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                  />
                </div>
              )}
              <div className="mb-3 text-xs font-semibold text-gray-400">
                <span>Click to cycle OR Long-press to pick</span>
              </div>
              <BondMatrix
                data={data}
                onCycleBond={bondData.cycleBond}
                onSetBond={bondData.setBond}
                activeFilters={activeFilters}
              />
            </>
          )}
        </main>

        {/* Desktop sidebar — always visible, in-flow (not fixed), so it never
            interferes with the ConfirmDialog's fixed positioning. */}
        {!isMobile && (
          <aside className="w-72 flex-shrink-0 border-l border-gray-100 bg-white/40 lg:w-80">
            <div
              className="sticky top-14 overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 56px)" }}
            >
              <h2 className="font-fredoka mb-4 flex items-center gap-2 text-base font-semibold text-gray-600">
                <span>👥</span> Manage Miis
              </h2>
              <NamePanel
                data={data}
                onAddName={bondData.addName}
                onRemoveName={bondData.requestRemoveName}
                onEditName={bondData.editName}
                onImport={bondData.importBondData}
              />
            </div>
          </aside>
        )}

        {/* Mobile slide-in panel */}
        {isMobile && (
          <>
            {mobilePanelOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                onClick={() => setMobilePanelOpen(false)}
              />
            )}
            <aside
              ref={sidebarRef}
              className={`fixed right-0 top-0 z-50 h-full w-72 transition-transform duration-300 ease-out ${mobilePanelOpen ? "translate-x-0" : "translate-x-full"} `}
              style={{ background: "#fef9f0" }}
            >
              <div
                className="overflow-y-auto p-4"
                style={{ height: "100%", paddingTop: "70px" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-fredoka text-base font-semibold text-gray-700">
                    Manage Miis
                  </h2>
                  <button
                    onClick={() => setMobilePanelOpen(false)}
                    className="rounded-lg p-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close panel"
                  >
                    ✕
                  </button>
                </div>
                <NamePanel
                  data={data}
                  onAddName={bondData.addName}
                  onRemoveName={bondData.requestRemoveName}
                  onEditName={bondData.editName}
                  onImport={bondData.importBondData}
                />
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Scroll-to-Top FAB — mobile only, hidden while the panel is open
          so it doesn't render above the backdrop.
          fab-safe-bottom ensures it clears the iPhone home indicator via
          env(safe-area-inset-bottom), falling back to 24px on other devices. */}
      {isMobile && !mobilePanelOpen && (
        <button
          className="btn-primary scroll-up fab-safe-bottom fixed right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-xl shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      <Footer />
    </div>
  );
}
