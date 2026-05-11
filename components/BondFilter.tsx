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
      <div className="flex items-center gap-2 flex-wrap">
      <span
          className="text-xs font-semibold text-gray-400 uppercase tracking-wide"
        style={{ fontFamily: "Nunito" }}
      >
        Filter:
      </span>

        {/* Select All — always visible; min-height 44px for touch */}
        <button
          onClick={onSelectAll}
          disabled={allSelected}
          aria-label="Select all bond type filters"
          className="touch-target rounded-lg px-2 text-xs font-semibold text-indigo-500
            hover:text-indigo-700 hover:bg-indigo-50 transition-colors
            disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
        >
          Select All
        </button>

        {/* Clear — conditional; same touch target size */}
        {hasActive && (
          <button
            onClick={onClearAll}
            aria-label="Clear all filters"
            className="touch-target rounded-lg px-2 text-xs font-semibold text-gray-400
              hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        )}

        {hasActive && (
          <span className="text-xs text-gray-400 leading-none">
            {activeFilters.size} of {ALL_BOND_LEVELS.length} shown
          </span>
        )}
      </div>

      {/* ── Pill row ───────────────────────────────────────────────
          overflow-x-auto + flex-nowrap prevents wrapping to 3–4 rows
          on narrow phones (412–430px). A scrollable single row is more
          scannable and keeps the filter bar a consistent height.      */}
      <div className="overflow-x-auto -mx-1 px-1 pb-1">
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
            className={`
                  touch-target flex items-center gap-1.5 px-3 py-2.5
                  rounded-full text-xs font-bold whitespace-nowrap
              transition-all duration-150 select-none border
              ${isActive
                ? `bond-cell-${level} ${cfg.textClass} border-transparent ring-2 ring-offset-1 ring-gray-500 scale-105`
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }
            `}
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
