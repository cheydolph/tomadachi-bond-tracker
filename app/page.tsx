"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useBondData } from "@/lib/hooks/useBondData";
import { useBondFilter } from "@/lib/hooks/useBondFilter";
import BondLegend from "@/components/BondLegend";
import BondFilter from "@/components/BondFilter";
import NamePanel from "@/components/NamePanel";
import ConfirmDialog from "@/components/ConfirmDialog";
import Footer from "@/components/Footer";

// Dynamic imports: both components rely on localStorage / browser APIs and
// must not run during SSR.
const BondMatrix = dynamic(() => import("@/components/BondMatrix"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="text-4xl animate-pulse">💕</div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-5xl animate-pulse">💕</div>
      </div>
    );
  }

  const { data, pendingRemove, confirmRemove, cancelRemove } = bondData;
  const { activeFilters, toggleFilter, selectAll, clearAll } = bondFilter;
  const hasEnoughNamesToFilter = data.names.length >= 2;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fef9f0 0%, #fdf2f8 50%, #f0fdf4 100%)",
      }}
    >
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
      <header className="sticky top-0 z-40 bg-yellow-300 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center flex-shrink-0 ring-2 ring-offset-0 ring-yellow-300 rounded-xl">
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
                borderRadius: "10px"
                }}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {data.names.length > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-base text-gray-500 bg-white rounded-full px-2.5 py-1 border border-gray-200">
                <span>👥</span>
                <span className="font-bold text-gray-700">{data.names.length}</span>{" "}
                Miis
              </span>
            )}
            <button
              onClick={() => setMobilePanelOpen((v) => !v)}
              className="md:hidden btn-secondary flex items-center gap-1 text-md"
              aria-label="Manage Miis"
            >
              <span>👥</span>
              <span>Miis</span>
              {data.names.length > 0 && (
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {data.names.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Legend bar (mobile / tablet only) */}
      <div className="lg:hidden px-4 py-2 overflow-x-auto">
        <BondLegend />
      </div>

      {/* ── Page body ───────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto flex relative">
        <main className="flex-1 p-4 min-w-0">
          {isMobile ? (
            <>
              {hasEnoughNamesToFilter && (
                <div className="mb-3 bg-white/60 rounded-xl px-3 py-2 border border-gray-100">
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
                <h2
                  className="text-lg font-semibold text-gray-700"
                  style={{ fontFamily: "Fredoka" }}
                >
                  Bond Matrix
                </h2>
                {hasEnoughNamesToFilter && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {data.names.length}×{data.names.length} grid ·{" "}
                    {data.names.length * (data.names.length - 1)} bonds tracked
                  </p>
                )}
              </div>
              {hasEnoughNamesToFilter && (
                <div className="mb-3 bg-white/60 rounded-xl px-3 py-2 border border-gray-100">
                  <BondFilter
                    activeFilters={activeFilters}
                    onToggle={toggleFilter}
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                  />
                </div>
              )}
              <div className="mb-3 text-xs font-semibold text-gray-400">
                <span>
                  Click to cycle OR Long-press to pick
                </span>
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
          <aside className="flex-shrink-0 w-72 lg:w-80 border-l border-gray-100 bg-white/40">
            <div
              className="sticky top-14 overflow-y-auto p-4"
              style={{ maxHeight: "calc(100vh - 56px)" }}
            >
              <h2
                className="text-base font-semibold text-gray-600 mb-4 flex items-center gap-2"
                style={{ fontFamily: "Fredoka" }}
              >
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
                className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                onClick={() => setMobilePanelOpen(false)}
              />
            )}
            <aside
              ref={sidebarRef}
              className={`
                fixed top-0 right-0 h-full w-72 z-50
                transition-transform duration-300 ease-out
                ${mobilePanelOpen ? "translate-x-0" : "translate-x-full"}
              `}
              style={{ background: "#fef9f0" }}
            >
              <div
                className="overflow-y-auto p-4"
                style={{ height: "100%", paddingTop: "70px" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="text-base font-semibold text-gray-700"
                    style={{ fontFamily: "Fredoka" }}
                  >
                    Manage Miis
                  </h2>
                  <button
                    onClick={() => setMobilePanelOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl p-1 rounded-lg hover:bg-gray-100"
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
          className="btn-primary scroll-up fab-safe-bottom fixed right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg"
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
