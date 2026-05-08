"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BondData, BondLevel } from "@/lib/types";
import {
  addName,
  cycleBond,
  editName,
  loadData,
  removeName,
  saveData,
  setBond,
} from "@/lib/storage";
import BondLegend from "@/components/BondLegend";
import NamePanel from "@/components/NamePanel";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const [data, setData] = useState<BondData>({
    version: 1,
    names: [],
    bonds: {},
  });
  const [hydrated, setHydrated] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // ConfirmDialog state lives at page level — outside sidebar's transform
  // stacking context — so position:fixed covers the full viewport correctly.
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile panel on outside tap
  useEffect(() => {
    if (!mobilePanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setMobilePanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobilePanelOpen]);

  const update = useCallback((next: BondData) => {
    setData(next);
    saveData(next);
  }, []);

  const handleAddName = useCallback(
    (name: string) => update(addName(data, name)),
    [data, update]
  );

  // Does NOT remove immediately — opens the confirmation dialog instead
  const handleRequestRemoveName = useCallback((name: string) => {
    setPendingRemove(name);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (!pendingRemove) return;
    update(removeName(data, pendingRemove));
    setPendingRemove(null);
  }, [data, pendingRemove, update]);

  const handleCancelRemove = useCallback(() => setPendingRemove(null), []);

  const handleEditName = useCallback(
    (old: string, next: string) => update(editName(data, old, next)),
    [data, update]
  );
  const handleCycleBond = useCallback(
    (from: string, to: string) => update(cycleBond(data, from, to)),
    [data, update]
  );
  const handleSetBond = useCallback(
    (from: string, to: string, level: BondLevel) =>
      update(setBond(data, from, to, level)),
    [data, update]
  );
  const handleImport = useCallback(
    (imported: BondData) => update(imported),
    [update]
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-5xl animate-pulse">💕</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fef9f0 0%, #fdf2f8 50%, #f0fdf4 100%)",
      }}
    >
      {/*
        ConfirmDialog is rendered here — at the top of the page tree,
        outside any sidebar element that has CSS transform applied.
        This ensures position:fixed covers the full document viewport.
      */}
      {pendingRemove && (
        <ConfirmDialog
          name={pendingRemove}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}

      {/* ── Sticky Menu Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-2xl">💕</span>
            <h1
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "Fredoka" }}
            >
              Tomadachi
              <span className="text-rose-400 ml-1 font-normal text-base hidden sm:inline">
                Bond Tracker
              </span>
            </h1>
          </div>

          {/* Legend — desktop centre */}
          <div className="hidden lg:flex flex-1 justify-center">
            <BondLegend />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {data.names.length > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 bg-white rounded-full px-2.5 py-1 border border-gray-200">
                <span>👥</span>
                <span className="font-bold text-gray-700">
                  {data.names.length}
                </span>{" "}
                people
              </span>
            )}
            {/* Mobile panel toggle — header button */}
            <button
              onClick={() => setMobilePanelOpen((v) => !v)}
              className="md:hidden btn-secondary flex items-center gap-1.5 text-sm"
              aria-label="Manage people"
            >
              <span>👥</span>
              <span>People</span>
              {data.names.length > 0 && (
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {data.names.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Legend bar for mobile/tablet */}
      <div className="lg:hidden px-4 py-2 overflow-x-auto">
        <BondLegend />
      </div>

      {/* ── Page body ──────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto flex relative">

        {/* Matrix or mobile card view */}
        <main className="flex-1 p-4 min-w-0">
          {isMobile ? (
            <MobileView
              data={data}
              onCycleBond={handleCycleBond}
              onSetBond={handleSetBond}
            />
          ) : (
            <>
              <div className="mb-3">
                <h2
                  className="text-lg font-semibold text-gray-700"
                  style={{ fontFamily: "Fredoka" }}
                >
                  Bond Matrix
                </h2>
                {data.names.length >= 2 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {data.names.length}×{data.names.length} grid ·{" "}
                    {data.names.length * (data.names.length - 1)} bonds tracked
                  </p>
                )}
              </div>
              <BondMatrix
                data={data}
                onCycleBond={handleCycleBond}
                onSetBond={handleSetBond}
              />
            </>
          )}
        </main>

        {/*
          Desktop sidebar — always visible, no toggle required.
          Uses sticky positioning relative to the page, not fixed,
          so it stays in the layout flow and never interferes with
          the ConfirmDialog's fixed positioning.
        */}
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
                <span>👥</span> Manage People
              </h2>
              <NamePanel
                data={data}
                onAddName={handleAddName}
                onRemoveName={handleRequestRemoveName}
                onEditName={handleEditName}
                onImport={handleImport}
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
                    Manage People
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
                  onAddName={handleAddName}
                  onRemoveName={handleRequestRemoveName}
                  onEditName={handleEditName}
                  onImport={handleImport}
                />
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Mobile FAB */}
      {isMobile && !mobilePanelOpen && (
        <button
          className="btn-primary fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg"
          onClick={() => setMobilePanelOpen(true)}
          aria-label="Manage people"
        >
          👥
        </button>
      )}
    </div>
  );
}
