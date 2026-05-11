"use client";

import React from "react";

import { ALL_BOND_LEVELS, BOND_CONFIG, BondLevel } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface BondCardProps {
  /** Canonical "from" person — used only when calling onSetBond. */
  from: string;
  /** Canonical "to" person — used for display text and calling onSetBond. */
  to: string;
  /**
   * Controls the card's primary label and subtitle:
   *
   * "pair"   → "{from} ↔ {to}" title, no subtitle.
   *            Used in ALL mode where both parties are shown together.
   *
   * "target" → "{to}" title with a "They see you as: X" subtitle showing
   *            reverseLevel. Used in person mode where the viewer is {from}.
   */
  displayMode: "pair" | "target";
  /** The bond level from `from` to `to`. */
  level: BondLevel;
  /**
   * The reverse bond level from `to` to `from`.
   * Rendered in "target" mode as "They see you as: X".
   * Omit in "pair" mode (bonds are symmetric so it would duplicate).
   */
  reverseLevel?: BondLevel;
  /** Whether the inline level picker is currently expanded. */
  isPickerOpen: boolean;
  /** Toggle the inline picker open/closed. */
  onTogglePicker: () => void;
  /** Called when the user selects a new bond level from the picker. */
  onSetBond: (from: string, to: string, level: BondLevel) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BondCard({
  from,
  to,
  displayMode,
  level,
  isPickerOpen,
  onTogglePicker,
  onSetBond,
}: BondCardProps) {
  const cfg = BOND_CONFIG[level];

  const renderPickerBtn = (lvl: BondLevel) => {
    const lcfg = BOND_CONFIG[lvl];
    return (
      <button
        key={lvl}
        onClick={() => onSetBond(from, to, lvl)}
        aria-label={`Set bond to ${lcfg.label}`}
        aria-pressed={level === lvl}
        className={`
          flex-1 min-w-[60px] min-h-[44px] flex flex-col items-center
          justify-center py-3 rounded-xl text-sm
          bond-cell-${lvl} transition-all
          ${level === lvl ? "ring-2 ring-gray-500 scale-105" : "hover:scale-105"}
        `}
      >
        <span className={`text-base ${lcfg.textClass}`} aria-hidden="true">
          {lcfg.symbol}
        </span>
        <span className={`text-[10px] font-bold mt-0.5 ${lcfg.textClass}`}>
          {lcfg.abbr}
        </span>
      </button>
    );
  };

  return (
    <div className="mobile-card">
      {/* ── Summary row ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Label / subtitle */}
        <div className="flex-1 min-w-0">
          {displayMode === "pair" ? (
            <p className="text-sm font-bold text-gray-800 truncate">
              {from}{" "}
              <span className="font-normal text-gray-400">↔</span>{" "}
              {to}
            </p>
          ) : (
            <p className="text-lg font-bold text-gray-800 truncate">{to}</p>
          )}
        </div>

        {/* Bond level badge — tap to open/close the picker */}
        <button
          className={`bond-cell-${level} min-h-[44px] rounded-xl px-3 py-2 flex items-center gap-1.5 flex-shrink-0`}
          onClick={onTogglePicker}
          aria-label={`${displayMode === "pair" ? `${from} and ${to}` : to}: ${cfg.label}. Tap to change.`}
          aria-expanded={isPickerOpen}
        >
          <span className={`text-base ${cfg.textClass}`} aria-hidden="true">
            {cfg.symbol}
          </span>
          <span className={`text-xs font-bold ${cfg.textClass}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400 ml-0.5" aria-hidden="true">
            ▾
          </span>
        </button>
      </div>

      {/* ── Inline level picker ──────────────────────────────────── */}
      {isPickerOpen && (
        <div
          className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 animate-slide-in"
          role="group"
          aria-label={`Choose bond level for ${displayMode === "pair" ? `${from} and ${to}` : to}`}
        >
          <div className="flex gap-2">
            {ALL_BOND_LEVELS.slice(0, 4).map(renderPickerBtn)}
          </div>
          <div className="flex gap-2 justify-center">
            {ALL_BOND_LEVELS.slice(4).map(renderPickerBtn)}
          </div>
        </div>
      )}
    </div>
  );
}
