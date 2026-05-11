"use client";

import React from "react";

import { BondLevel, BOND_CONFIG, ALL_BOND_LEVELS } from "@/lib/types";

interface BondFilterProps {
  activeFilters: Set<BondLevel>;
  onToggle: (level: BondLevel) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export default function BondFilter({
  activeFilters,
  onToggle,
  onSelectAll,
  onClearAll,
}: BondFilterProps) {
  const hasActive = activeFilters.size > 0;
  const allSelected = activeFilters.size === ALL_BOND_LEVELS.length;

  return (
    <div className="flex flex-col gap-1.5">
      {/* ── Control row ────────────────────────────────────────────
          Kept separate from the pill row so the pills can scroll
          horizontally without dragging the labels with them.        */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wide text-gray-400"
          style={{ fontFamily: "Nunito" }}
        >
          Filter:
        </span>

        {/* Select All — always visible; min-height 44px for touch */}
        <button
          onClick={onSelectAll}
          disabled={allSelected}
          aria-label="Select all bond type filters"
          className="touch-target rounded-lg px-2 text-xs font-semibold text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Select All
        </button>

        {/* Clear — conditional; same touch target size */}
        {hasActive && (
          <button
            onClick={onClearAll}
            aria-label="Clear all filters"
            className="touch-target rounded-lg px-2 text-xs font-semibold text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            Clear
          </button>
        )}

        {hasActive && (
          <span className="text-xs leading-none text-gray-400">
            {activeFilters.size} of {ALL_BOND_LEVELS.length} shown
          </span>
        )}
      </div>

      {/* ── Pill row ───────────────────────────────────────────────
          overflow-x-auto + flex-nowrap prevents wrapping to 3–4 rows
          on narrow phones (412–430px). A scrollable single row is more
          scannable and keeps the filter bar a consistent height.      */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex items-center gap-1.5" style={{ width: "max-content" }}>
          {ALL_BOND_LEVELS.map((level) => {
            const cfg = BOND_CONFIG[level];
            const isActive = activeFilters.has(level);

            return (
              <button
                key={level}
                onClick={() => onToggle(level)}
                aria-pressed={isActive}
                title={`${isActive ? "Remove" : "Add"} filter: ${cfg.label}`}
                // min-h-[44px] meets the touch target minimum.
                // px-3 py-2.5 gives comfortable tap area around the label.
                className={`touch-target flex select-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2.5 text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? `bond-cell-${level} ${cfg.textClass} scale-105 border-transparent ring-2 ring-gray-500 ring-offset-1`
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } `}
              >
                <span aria-hidden="true">{cfg.symbol}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
