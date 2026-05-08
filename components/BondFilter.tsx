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
    <div className="flex flex-wrap items-center gap-4">
      <span
        className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0"
        style={{ fontFamily: "Nunito" }}
      >
        Filter:
      </span>

      {ALL_BOND_LEVELS.map((level) => {
        const cfg = BOND_CONFIG[level];
        const isActive = activeFilters.has(level);

        return (
          <button
            key={level}
            onClick={() => onToggle(level)}
            aria-pressed={isActive}
            title={`${isActive ? "Remove" : "Add"} filter: ${cfg.label}`}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
              transition-all duration-150 select-none border
              ${isActive
                ? `bond-cell-${level} border-transparent ring-2 ring-offset-1 ring-gray-500 scale-105`
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }
            `}
          >
            <span>{cfg.symbol}</span>
            <span>{cfg.label}</span>
          </button>
        );
      })}

      {/* Select All — always visible */}
      <button
        onClick={onSelectAll}
        disabled={allSelected}
        className="text-xs text-indigo-500 hover:text-indigo-700 underline underline-offset-2 transition-colors ml-1 disabled:opacity-40 disabled:cursor-default"
        title="Select all bond types"
      >
        Select All
      </button>

      {/* Clear — only shown when at least one filter is active */}
      {hasActive && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          title="Clear all filters"
        >
          Clear
        </button>
      )}

      {hasActive && (
        <span className="text-xs text-gray-400">
          — {activeFilters.size} of {ALL_BOND_LEVELS.length} shown
        </span>
      )}
    </div>
  );
}
