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
}: Readonly<BondCardProps>): JSX.Element {
  const cfg = BOND_CONFIG[level];

  // Extracted to avoid nested template literals in JSX attributes. (S4624)
  // Used in both the badge aria-label and the picker fieldset legend.
  const pairLabel = displayMode === "pair" ? `${from} and ${to}` : to;

  // Extracted render helper — avoids duplicating button JSX across the two
  // picker rows (top 4 / bottom 3 layout). Defined inside the component so it
  // closes over `level`, `from`, `to`, and `onSetBond`.
  const renderPickerBtn = (lvl: BondLevel): JSX.Element => {
    const lcfg = BOND_CONFIG[lvl];
    return (
      <button
        key={lvl}
        onClick={() => onSetBond(from, to, lvl)}
        aria-label={`Set bond to ${lcfg.label}`}
        aria-pressed={level === lvl}
        className={`flex min-h-[44px] min-w-[60px] flex-1 flex-col items-center justify-center rounded-xl py-3 text-sm bond-cell-${lvl} transition-all ${level === lvl ? "scale-105 ring-2 ring-gray-500" : "hover:scale-105"} `}
      >
        <span className={`text-base ${lcfg.textClass}`} aria-hidden="true">
          {lcfg.symbol}
        </span>
        <span className={`mt-0.5 text-[10px] font-bold ${lcfg.textClass}`}>
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
        <div className="min-w-0 flex-1">
          {displayMode === "pair" ? (
            <p className="truncate text-sm font-bold text-gray-800">
              {from} <span className="font-normal text-gray-400">↔</span> {to}
            </p>
          ) : (
            <p className="truncate text-lg font-bold text-gray-800">{to}</p>
          )}
        </div>

        {/* Bond level badge — tap to open/close the picker */}
        <button
          className={`bond-cell-${level} flex min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2`}
          onClick={onTogglePicker}
          aria-label={`${pairLabel}: ${cfg.label}. Tap to change.`}
          aria-expanded={isPickerOpen}
        >
          <span className={`text-base ${cfg.textClass}`} aria-hidden="true">
            {cfg.symbol}
          </span>
          <span className={`text-xs font-bold ${cfg.textClass}`}>{cfg.label}</span>
          <span className="ml-0.5 text-xs text-gray-400" aria-hidden="true">
            ▾
          </span>
        </button>
      </div>

      {/* ── Inline level picker ──────────────────────────────────── */}
      {isPickerOpen && (
        // <fieldset> is the semantic HTML equivalent of role="group" for a
        // set of related form controls. (S6819)
        <fieldset className="flex animate-slide-in flex-col gap-2 border-x-0 border-b-0 border-t border-gray-100 px-4 py-3">
          <legend className="sr-only">Choose bond level for {pairLabel}</legend>
          <div className="flex gap-2">
            {ALL_BOND_LEVELS.slice(0, 4).map(renderPickerBtn)}
          </div>
          <div className="flex justify-center gap-2">
            {ALL_BOND_LEVELS.slice(4).map(renderPickerBtn)}
          </div>
        </fieldset>
      )}
    </div>
  );
}
